"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole, requireUser } from "@/lib/auth-helpers";
import { threadIdFor } from "@/lib/messaging";
import { hasUnlockedTutor } from "@/lib/payments";

export type ActionState = { error?: string; ok?: boolean };

// ── Requirements ───────────────────────────────────────────────────────────

const requirementSchema = z.object({
  subject: z.string().min(2, "Subject is required"),
  level: z.string().optional(),
  mode: z.enum(["online", "in-person", "either"]).optional(),
  budget: z.string().optional(),
  location: z.string().optional(),
  description: z.string().min(20, "Please describe your needs (min 20 characters)"),
});

export async function createRequirement(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireRole(["STUDENT", "ADMIN"]);
  const parsed = requirementSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  await prisma.requirement.create({
    data: { ...parsed.data, studentId: user.id },
  });
  revalidatePath("/student/requirements");
  return { ok: true };
}

export async function updateRequirement(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireRole(["STUDENT", "ADMIN"]);
  const id = String(formData.get("id") ?? "");
  const parsed = requirementSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  // Only the owner can edit (admins may edit any).
  const existing = await prisma.requirement.findUnique({ where: { id } });
  if (!existing || (existing.studentId !== user.id && user.role !== "ADMIN")) {
    return { error: "Requirement not found." };
  }
  await prisma.requirement.update({ where: { id }, data: parsed.data });
  revalidatePath("/student/requirements");
  return { ok: true };
}

/** Combined create/update used by the requirements form (branches on `id`). */
export async function saveRequirement(
  prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "").trim();
  return id ? updateRequirement(prev, formData) : createRequirement(prev, formData);
}

export async function setRequirementStatus(formData: FormData): Promise<void> {
  const user = await requireRole(["STUDENT", "ADMIN"]);
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!["open", "closed"].includes(status)) return;
  const existing = await prisma.requirement.findUnique({ where: { id } });
  if (!existing || (existing.studentId !== user.id && user.role !== "ADMIN")) return;
  await prisma.requirement.update({ where: { id }, data: { status } });
  revalidatePath("/student/requirements");
}

// ── Messaging ────────────────────────────────────────────────────────────

export async function startConversation(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  const targetId = String(formData.get("targetId") ?? "");
  const content = String(formData.get("content") ?? "").trim();

  if (!user) redirect(`/login?callbackUrl=/tutors/${targetId}`);
  if (!targetId || targetId === user.id || !content) return;

  // Students must unlock a tutor before messaging; admins bypass. If not yet
  // unlocked, divert them to the unlock checkout instead of sending.
  if (user.role === "STUDENT" && !(await hasUnlockedTutor(user.id, targetId))) {
    redirect(`/tutors/${targetId}`);
  }

  const threadId = threadIdFor(user.id, targetId);
  await prisma.message.create({
    data: { senderId: user.id, receiverId: targetId, threadId, content },
  });

  if (user.role === "TEACHER") {
    redirect(`/teacher/messages/${threadId}`);
  } else {
    redirect(`/student/messages/${threadId}`);
  }
}

export async function sendMessage(formData: FormData): Promise<void> {
  const user = await requireUser();
  const threadId = String(formData.get("threadId") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  if (!content || !threadId.includes("__")) return;

  const [a, b] = threadId.split("__");
  if (user.id !== a && user.id !== b) return; // not a participant
  const receiverId = user.id === a ? b : a;

  await prisma.message.create({
    data: { senderId: user.id, receiverId, threadId, content },
  });
  // The composer is shared by both sides; revalidate whichever thread view is open.
  revalidatePath(`/student/messages/${threadId}`);
  revalidatePath(`/teacher/messages/${threadId}`);
}

// ── Reviews ──────────────────────────────────────────────────────────────

const reviewSchema = z.object({
  targetId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export async function submitReview(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireRole(["STUDENT", "ADMIN"]);
  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Please select a rating." };
  const { targetId, rating, comment } = parsed.data;

  if (targetId === user.id) return { error: "You cannot review yourself." };
  const target = await prisma.user.findFirst({
    where: { id: targetId, role: "TEACHER" },
  });
  if (!target) return { error: "Teacher not found." };

  await prisma.review.upsert({
    where: { authorId_targetId: { authorId: user.id, targetId } },
    update: { rating, comment: comment || null },
    create: { authorId: user.id, targetId, rating, comment: comment || null },
  });

  await recomputeTeacherRating(targetId);
  revalidatePath(`/tutors/${targetId}`);
  revalidatePath("/student/reviews");
  return { ok: true };
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

// ── Settings ───────────────────────────────────────────────────────────

const settingsSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  phone: z.string().max(30).optional(),
  location: z.string().max(120).optional(),
});

export async function updateStudentSettings(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name, phone: parsed.data.phone || null },
  });
  await prisma.studentProfile.upsert({
    where: { userId: user.id },
    update: { location: parsed.data.location || null },
    create: { userId: user.id, location: parsed.data.location || null },
  });
  revalidatePath("/student/settings");
  return { ok: true };
}
