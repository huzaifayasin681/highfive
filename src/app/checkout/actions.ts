"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth-helpers";
import { paymentSchema } from "@/lib/validation";
import {
  PAYMENT_TYPES,
  PAYMENT_LABELS,
  PRICES,
  completePayment,
  createPendingPayment,
  hasUnlockedTutor,
  submitPaymentForReview,
  type PaymentType,
  type PaymentMetadata,
} from "@/lib/payments";

export type CheckoutState = { error?: string };

/**
 * Reuse an open pending payment of the same type/target for a user so refreshing
 * or re-clicking doesn't spawn duplicate orders; otherwise create a new one.
 */
async function findOrCreatePending(input: {
  userId: string;
  type: PaymentType;
  amount: number;
  description: string;
  targetId?: string | null;
  metadata?: PaymentMetadata;
}) {
  const existing = await prisma.payment.findFirst({
    where: {
      userId: input.userId,
      type: input.type,
      targetId: input.targetId ?? null,
      status: { in: ["pending", "under_review"] },
    },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return existing;
  return createPendingPayment(input);
}

// ── Flow starters (create a pending order, then jump to the gateway) ──────────

/** Ensures a pending registration order exists for the student; returns its id. */
export async function ensureRegistrationPayment(userId: string): Promise<string> {
  const order = await findOrCreatePending({
    userId,
    type: PAYMENT_TYPES.REGISTRATION,
    amount: PRICES.REGISTRATION,
    description: PAYMENT_LABELS.REGISTRATION,
  });
  return order.id;
}

export async function startUnlockPayment(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  const targetId = String(formData.get("targetId") ?? "");
  if (!user) redirect(`/login?callbackUrl=/tutors/${targetId}`);
  if (!targetId || targetId === user.id) redirect(`/tutors/${targetId}`);

  // Admins/teachers never need to unlock.
  if (user.role !== "STUDENT") redirect(`/tutors/${targetId}`);
  if (await hasUnlockedTutor(user.id, targetId)) redirect(`/tutors/${targetId}`);

  const teacher = await prisma.user.findFirst({
    where: { id: targetId, role: "TEACHER" },
    select: { name: true },
  });
  if (!teacher) redirect("/search");

  const order = await findOrCreatePending({
    userId: user.id,
    type: PAYMENT_TYPES.UNLOCK_TUTOR,
    amount: PRICES.UNLOCK_TUTOR,
    description: `Unlock contact with ${teacher.name}`,
    targetId,
  });
  redirect(`/checkout/${order.id}`);
}

export async function startSessionBooking(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  const targetId = String(formData.get("targetId") ?? "");
  const date = String(formData.get("date") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!user) redirect(`/login?callbackUrl=/tutors/${targetId}`);
  if (!targetId || targetId === user.id) redirect(`/tutors/${targetId}`);

  const teacher = await prisma.user.findFirst({
    where: { id: targetId, role: "TEACHER" },
    select: { name: true, teacherProfile: { select: { hourlyRate: true } } },
  });
  if (!teacher) redirect("/search");

  const amount = teacher.teacherProfile?.hourlyRate ?? 0;
  const metadata: PaymentMetadata = {};
  if (date) metadata.date = date;
  if (note) metadata.note = note;

  const order = await createPendingPayment({
    userId: user.id,
    type: PAYMENT_TYPES.SESSION_BOOKING,
    amount,
    description: `Session booking with ${teacher.name}`,
    targetId,
    metadata,
  });
  redirect(`/checkout/${order.id}`);
}

export async function startSubscriptionPayment(): Promise<void> {
  const user = await requireRole(["TEACHER", "ADMIN"]);
  const order = await findOrCreatePending({
    userId: user.id,
    type: PAYMENT_TYPES.TEACHER_SUBSCRIPTION,
    amount: PRICES.TEACHER_SUBSCRIPTION,
    description: PAYMENT_LABELS.TEACHER_SUBSCRIPTION,
  });
  redirect(`/checkout/${order.id}`);
}

// ── Gateway confirmation ─────────────────────────────────────────────────────

/** Where to send the user after a successful payment, based on its type. */
function destinationFor(type: string, targetId: string | null): string {
  switch (type) {
    case PAYMENT_TYPES.REGISTRATION:
      return "/student";
    case PAYMENT_TYPES.UNLOCK_TUTOR:
      return targetId ? `/tutors/${targetId}` : "/search";
    case PAYMENT_TYPES.SESSION_BOOKING:
      return "/student/payments";
    case PAYMENT_TYPES.TEACHER_SUBSCRIPTION:
      return "/teacher/leads";
    default:
      return "/";
  }
}

export async function confirmPayment(
  _prev: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = paymentSchema.safeParse({
    paymentId: formData.get("paymentId"),
    method: formData.get("method"),
    mobileNumber: formData.get("mobileNumber"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid payment details" };
  }

  const receiptFile = formData.get("receipt") as File | null;
  if (!receiptFile || receiptFile.size === 0) {
    return { error: "Please upload your payment screenshot" };
  }
  if (receiptFile.size > 5 * 1024 * 1024) {
    return { error: "Receipt image must be less than 5MB" };
  }

  const buffer = Buffer.from(await receiptFile.arrayBuffer());
  const mimeType = receiptFile.type || "image/jpeg";
  const receiptUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

  const { paymentId, method, mobileNumber } = parsed.data;
  const result = await submitPaymentForReview(paymentId, user.id, method as any, mobileNumber, receiptUrl);
  if (!result) {
    return { error: "This payment could not be processed. Please try again." };
  }

  revalidatePath("/student/payments");
  revalidatePath("/teacher/subscription");
  revalidatePath("/admin/payments");
  if (result.targetId) revalidatePath(`/tutors/${result.targetId}`);

  redirect(destinationFor(result.type, result.targetId));
}
