"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";

export type PasswordActionState = { error?: string; ok?: boolean };

const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function updatePassword(
  _prev: PasswordActionState,
  formData: FormData
): Promise<PasswordActionState> {
  const user = await requireUser();
  const parsed = passwordSchema.safeParse({
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  revalidatePath("/student/settings");
  revalidatePath("/teacher/settings");
  revalidatePath("/admin/settings");

  return { ok: true };
}
