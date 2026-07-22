"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validation";

export type AuthFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

// All successful auth flows funnel through /dashboard, which then redirects the
// user to the correct home for their role.
const POST_LOGIN_PATH = "/dashboard";

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: flattenZod(parsed.error) };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirectTo: POST_LOGIN_PATH,
    });
  } catch (error) {
    if (isRedirectError(error)) throw error; // success — let the redirect happen
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
  return {};
}

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { fieldErrors: flattenZod(parsed.error) };
  }

  const { name, email, password, role } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    return { fieldErrors: { email: "An account with this email already exists." } };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
      role,
      // Email verification is a later step; mark unverified for now.
      emailVerified: false,
      ...(role === "STUDENT"
        ? { studentProfile: { create: {} } }
        : { teacherProfile: { create: {} } }),
    },
  });

  // New students must pay the one-time registration fee before their dashboard
  // unlocks; teachers go straight through.
  const redirectTo =
    role === "STUDENT" ? "/checkout/registration" : POST_LOGIN_PATH;

  try {
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirectTo,
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof AuthError) {
      // Account exists but auto-login failed — send them to the login page.
      return { error: "Account created. Please log in." };
    }
    throw error;
  }
  return {};
}

function flattenZod(error: import("zod").ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
