"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { logAudit } from "@/lib/admin";

// ── Users ────────────────────────────────────────────────────────────────

export async function setUserStatus(formData: FormData): Promise<void> {
  const admin = await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!["active", "suspended"].includes(status) || !id) return;
  if (id === admin.id) return; // never suspend yourself

  await prisma.user.update({ where: { id }, data: { status } });
  await logAudit(admin.id, status === "suspended" ? "USER_SUSPENDED" : "USER_REACTIVATED", "User", id);
  revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData): Promise<void> {
  const admin = await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  if (!id || id === admin.id) return; // never delete yourself

  const user = await prisma.user.findUnique({ where: { id }, select: { email: true } });
  await prisma.user.delete({ where: { id } });
  await logAudit(admin.id, "USER_DELETED", "User", id, user?.email ?? undefined);
  revalidatePath("/admin/users");
}

// ── Teacher verification ──────────────────────────────────────────────────

export async function setTeacherVerification(formData: FormData): Promise<void> {
  const admin = await requireRole("ADMIN");
  const userId = String(formData.get("userId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!userId || !["approved", "rejected"].includes(decision)) return;

  await prisma.teacherProfile.updateMany({
    where: { userId },
    data: { verificationStatus: decision, verified: decision === "approved" },
  });
  await logAudit(
    admin.id,
    decision === "approved" ? "TEACHER_APPROVED" : "TEACHER_REJECTED",
    "TeacherProfile",
    userId
  );
  revalidatePath("/admin/verification");
  revalidatePath("/search");
  revalidatePath(`/tutors/${userId}`);
}

// ── Subjects ──────────────────────────────────────────────────────────────

export async function createSubject(formData: FormData): Promise<void> {
  const admin = await requireRole("ADMIN");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const existing = await prisma.subject.findUnique({ where: { name } });
  if (existing) return;
  const subject = await prisma.subject.create({ data: { name } });
  await logAudit(admin.id, "SUBJECT_CREATED", "Subject", subject.id, name);
  revalidatePath("/admin/subjects");
}

export async function renameSubject(formData: FormData): Promise<void> {
  const admin = await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;
  await prisma.subject.update({ where: { id }, data: { name } });
  await logAudit(admin.id, "SUBJECT_RENAMED", "Subject", id, name);
  revalidatePath("/admin/subjects");
}

export async function deleteSubject(formData: FormData): Promise<void> {
  const admin = await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.subject.delete({ where: { id } });
  await logAudit(admin.id, "SUBJECT_DELETED", "Subject", id);
  revalidatePath("/admin/subjects");
}

// ── Content blocks (simple CMS) ────────────────────────────────────────────

export async function saveContentBlock(formData: FormData): Promise<void> {
  const admin = await requireRole("ADMIN");
  const key = String(formData.get("key") ?? "").trim();
  const value = String(formData.get("value") ?? "");
  if (!key) return;
  await prisma.contentBlock.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  await logAudit(admin.id, "CONTENT_UPDATED", "ContentBlock", key);
  revalidatePath("/admin/content");
}

export async function deleteContentBlock(formData: FormData): Promise<void> {
  const admin = await requireRole("ADMIN");
  const key = String(formData.get("key") ?? "").trim();
  if (!key) return;
  await prisma.contentBlock.deleteMany({ where: { key } });
  await logAudit(admin.id, "CONTENT_DELETED", "ContentBlock", key);
  revalidatePath("/admin/content");
}

// ── Moderation ──────────────────────────────────────────────────────────

export async function setReviewHidden(formData: FormData): Promise<void> {
  const admin = await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  const hidden = String(formData.get("hidden") ?? "") === "true";
  if (!id) return;

  const review = await prisma.review.update({ where: { id }, data: { hidden } });
  // Keep the teacher's aggregate honest after hiding/showing.
  await recomputeTeacherRating(review.targetId);
  await logAudit(admin.id, hidden ? "REVIEW_HIDDEN" : "REVIEW_RESTORED", "Review", id);
  revalidatePath("/admin/moderation");
  revalidatePath(`/tutors/${review.targetId}`);
}

export async function deleteReview(formData: FormData): Promise<void> {
  const admin = await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const review = await prisma.review.delete({ where: { id } });
  await recomputeTeacherRating(review.targetId);
  await logAudit(admin.id, "REVIEW_DELETED", "Review", id);
  revalidatePath("/admin/moderation");
  revalidatePath(`/tutors/${review.targetId}`);
}

export async function moderateRequirement(formData: FormData): Promise<void> {
  const admin = await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  const op = String(formData.get("op") ?? "");
  if (!id) return;

  if (op === "delete") {
    await prisma.requirement.delete({ where: { id } });
    await logAudit(admin.id, "REQUIREMENT_DELETED", "Requirement", id);
  } else if (op === "close" || op === "open") {
    await prisma.requirement.update({ where: { id }, data: { status: op === "close" ? "closed" : "open" } });
    await logAudit(admin.id, op === "close" ? "REQUIREMENT_CLOSED" : "REQUIREMENT_REOPENED", "Requirement", id);
  }
  revalidatePath("/admin/moderation");
}

// ── Contact inbox ──────────────────────────────────────────────────────────

export async function setContactRead(formData: FormData): Promise<void> {
  await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  const read = String(formData.get("read") ?? "") === "true";
  if (!id) return;
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin/inbox");
}

export async function deleteContactMessage(formData: FormData): Promise<void> {
  const admin = await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.contactMessage.delete({ where: { id } });
  await logAudit(admin.id, "CONTACT_DELETED", "ContactMessage", id);
  revalidatePath("/admin/inbox");
}

async function recomputeTeacherRating(targetId: string) {
  const agg = await prisma.review.aggregate({
    where: { targetId, hidden: false },
    _avg: { rating: true },
    _count: true,
  });
  await prisma.teacherProfile.updateMany({
    where: { userId: targetId },
    data: {
      rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      reviewsCount: agg._count,
    },
  });
}
