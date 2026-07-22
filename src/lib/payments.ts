import { prisma } from "@/lib/prisma";

// ── Payment types & pricing ─────────────────────────────────────────────────

export const PAYMENT_TYPES = {
  REGISTRATION: "REGISTRATION",
  UNLOCK_TUTOR: "UNLOCK_TUTOR",
  SESSION_BOOKING: "SESSION_BOOKING",
  TEACHER_SUBSCRIPTION: "TEACHER_SUBSCRIPTION",
} as const;

export type PaymentType = (typeof PAYMENT_TYPES)[keyof typeof PAYMENT_TYPES];

/** Fixed prices (PKR). Session booking is priced from the tutor's hourly rate. */
export const PRICES = {
  REGISTRATION: 500,
  UNLOCK_TUTOR: 200,
  TEACHER_SUBSCRIPTION: 2000,
} as const;

/** Teacher subscription is valid for this many days after payment. */
export const SUBSCRIPTION_DAYS = 30;

export const PAYMENT_LABELS: Record<PaymentType, string> = {
  REGISTRATION: "Student registration fee",
  UNLOCK_TUTOR: "Unlock tutor contact",
  SESSION_BOOKING: "Session booking",
  TEACHER_SUBSCRIPTION: "Teacher subscription (30 days)",
};

export const PAYMENT_METHODS = ["jazzcash", "easypaisa"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export function isPaymentMethod(v: string): v is PaymentMethod {
  return (PAYMENT_METHODS as readonly string[]).includes(v);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Realistic-looking gateway transaction reference, e.g. "HF-8F3K2A9QZ1". */
export function generateReference(): string {
  const rand = Math.random().toString(36).slice(2, 12).toUpperCase();
  return `HF-${rand}`;
}

export function formatPKR(amount: number): string {
  return `Rs ${Math.round(amount).toLocaleString("en-PK")}`;
}

export type PaymentMetadata = Record<string, string>;

/**
 * Creates a pending payment for a user. Callers redirect to /checkout/[id]
 * afterwards to render the gateway.
 */
export async function createPendingPayment(input: {
  userId: string;
  type: PaymentType;
  amount: number;
  description: string;
  targetId?: string | null;
  metadata?: PaymentMetadata;
}) {
  return prisma.payment.create({
    data: {
      userId: input.userId,
      type: input.type,
      amount: input.amount,
      description: input.description,
      reference: generateReference(),
      targetId: input.targetId ?? null,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      status: "pending",
    },
  });
}

/**
 * Marks a pending payment as paid and applies its side-effects atomically.
 * Returns the updated payment, or null if it was not found / not the owner's /
 * already settled.
 */
export async function completePayment(
  paymentId: string,
  method?: PaymentMethod,
  mobileNumber?: string
) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment || (payment.status !== "pending" && payment.status !== "under_review")) {
    return null;
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: "paid",
        ...(method ? { method } : {}),
        ...(mobileNumber ? { mobileNumber } : {}),
        paidAt: new Date(),
      },
    });

    // Side-effects that need a persisted flag (everything else is derived).
    if (updated.type === PAYMENT_TYPES.REGISTRATION) {
      await tx.user.update({
        where: { id: payment.userId },
        data: { registrationPaid: true },
      });
    }

    return updated;
  });
}

/**
 * Submits a payment for admin review along with a receipt screenshot.
 * The payment status becomes "under_review". No side-effects are applied yet.
 */
export async function submitPaymentForReview(
  paymentId: string,
  userId: string,
  method: PaymentMethod,
  mobileNumber: string,
  receiptUrl: string
) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment || payment.userId !== userId || payment.status !== "pending") {
    return null;
  }

  return prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: "under_review",
      method,
      mobileNumber,
      receiptUrl,
    },
  });
}

/** Has the student paid to unlock this specific tutor's contact? */
export async function hasUnlockedTutor(
  studentId: string,
  teacherId: string
): Promise<boolean> {
  const count = await prisma.payment.count({
    where: {
      userId: studentId,
      targetId: teacherId,
      type: PAYMENT_TYPES.UNLOCK_TUTOR,
      status: "paid",
    },
  });
  return count > 0;
}

/** Whether a teacher currently has an active (non-expired) subscription. */
export async function getSubscription(teacherId: string): Promise<{
  active: boolean;
  expiresAt: Date | null;
}> {
  const latest = await prisma.payment.findFirst({
    where: {
      userId: teacherId,
      type: PAYMENT_TYPES.TEACHER_SUBSCRIPTION,
      status: "paid",
    },
    orderBy: { paidAt: "desc" },
  });
  if (!latest?.paidAt) return { active: false, expiresAt: null };

  const expiresAt = new Date(
    latest.paidAt.getTime() + SUBSCRIPTION_DAYS * 86_400_000
  );
  return { active: expiresAt.getTime() > Date.now(), expiresAt };
}

export async function isRegistrationPaid(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { registrationPaid: true },
  });
  return !!user?.registrationPaid;
}

export async function getUserPayments(userId: string) {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
