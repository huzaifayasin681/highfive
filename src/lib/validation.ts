import { z } from "zod";

export const ROLES = ["STUDENT", "TEACHER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Please enter your full name").max(100),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["STUDENT", "TEACHER"], {
    message: "Choose whether you are a student or a teacher",
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// Simulated JazzCash / EasyPaisa wallet payment. Pakistani mobile numbers are
// 11 digits starting "03" (e.g. 03001234567); the wallet PIN is 4–6 digits.
export const paymentSchema = z.object({
  paymentId: z.string().min(1),
  method: z.enum(["jazzcash", "easypaisa"], {
    message: "Choose a payment method",
  }),
  mobileNumber: z
    .string()
    .trim()
    .regex(/^03\d{9}$/, "Enter a valid mobile number (e.g. 03001234567)"),
});

export type PaymentInput = z.infer<typeof paymentSchema>;
