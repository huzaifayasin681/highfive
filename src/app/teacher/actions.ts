"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, requireUser } from "@/lib/auth-helpers";
import { MIN_BIO_LENGTH } from "@/lib/teacher";

export type ActionState = { error?: string; ok?: boolean };

const profileSchema = z.object({
  bio: z.string().trim().min(MIN_BIO_LENGTH, `Bio must be at least ${MIN_BIO_LENGTH} characters`),
  qualifications: z.string().trim().min(1, "Please add your qualifications"),
  experienceYears: z.coerce.number().int().min(0).max(70),
  hourlyRate: z.coerce.number().min(0).max(100000),
  mode: z.enum(["online", "in-person", "both"]),
  location: z.string().trim().max(120).optional(),
  photoUrl: z.string().trim().url("Enter a valid image URL").or(z.literal("")).optional(),
  responseTime: z.string().trim().max(60).optional(),
});

export async function updateTeacherProfile(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireRole(["TEACHER", "ADMIN"]);

  const parsed = profileSchema.safeParse({
    bio: formData.get("bio"),
    qualifications: formData.get("qualifications"),
    experienceYears: formData.get("experienceYears"),
    hourlyRate: formData.get("hourlyRate"),
    mode: formData.get("mode"),
    location: formData.get("location") ?? "",
    photoUrl: formData.get("photoUrl") ?? "",
    responseTime: formData.get("responseTime") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const subjectNames = formData.getAll("subjects").map(String).filter(Boolean);
  const subjects = await prisma.subject.findMany({
    where: { name: { in: subjectNames } },
    select: { id: true },
  });

  const base = {
    bio: parsed.data.bio,
    qualifications: parsed.data.qualifications,
    experienceYears: parsed.data.experienceYears,
    hourlyRate: parsed.data.hourlyRate,
    mode: parsed.data.mode,
    location: parsed.data.location || null,
    photoUrl: parsed.data.photoUrl || null,
    responseTime: parsed.data.responseTime || null,
  };
  const subjectRefs = subjects.map((s) => ({ id: s.id }));

  await prisma.teacherProfile.upsert({
    where: { userId: user.id },
    update: { ...base, subjects: { set: subjectRefs } },
    create: { userId: user.id, ...base, subjects: { connect: subjectRefs } },
  });

  revalidatePath("/teacher");
  revalidatePath("/teacher/profile");
  revalidatePath(`/tutors/${user.id}`);
  return { ok: true };
}

const accountSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  phone: z.string().trim().max(30).optional(),
});

export async function updateTeacherAccount(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = accountSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name, phone: parsed.data.phone || null },
  });
  revalidatePath("/teacher/settings");
  return { ok: true };
}
