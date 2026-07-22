"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-helpers";
import { completePayment } from "@/lib/payments";
import { prisma } from "@/lib/prisma";

export async function approvePayment(formData: FormData) {
  await requireRole("ADMIN");
  
  const paymentId = String(formData.get("paymentId"));
  
  // Since completePayment processes side effects and sets status to "paid",
  // we just need to call it. It requires the payment to be in "under_review" or "pending".
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment || payment.status !== "under_review") {
    return { error: "Payment not under review" };
  }

  const result = await completePayment(paymentId);
  if (!result) {
    return { error: "Failed to approve payment" };
  }

  revalidatePath("/admin/payments");
  if (result.targetId) revalidatePath(`/tutors/${result.targetId}`);
  
  return { ok: true };
}
