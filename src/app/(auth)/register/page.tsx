"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { GraduationCap, BookOpen, Users } from "lucide-react";
import { registerAction, type AuthFormState } from "../actions";

const initialState: AuthFormState = {};

export default function RegisterPage() {
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-highfive-blue to-teal-700 px-8 pt-8 pb-6 text-white">
            <div className="flex items-center gap-2.5 mb-3">
              <GraduationCap className="w-6 h-6" />
              <span className="font-extrabold text-lg">HighFive Tutors</span>
            </div>
            <h1 className="text-2xl font-extrabold">Create your account</h1>
            <p className="text-emerald-200 text-sm mt-1">
              {role === "STUDENT"
                ? "Find the right tutor and start learning."
                : "Build your profile and reach new students."}
            </p>
          </div>

          <form action={formAction} className="p-8 space-y-4">
            {state.error && (
              <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 border border-red-100">
                {state.error}
              </div>
            )}

            {/* Role toggle */}
            <input type="hidden" name="role" value={role} />
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold rounded-lg transition-colors ${
                  role === "STUDENT" ? "bg-white text-highfive-blue shadow-sm" : "text-slate-500"
                }`}
              >
                <BookOpen className="w-4 h-4" /> I&apos;m a Student
              </button>
              <button
                type="button"
                onClick={() => setRole("TEACHER")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold rounded-lg transition-colors ${
                  role === "TEACHER" ? "bg-white text-highfive-blue shadow-sm" : "text-slate-500"
                }`}
              >
                <Users className="w-4 h-4" /> I&apos;m a Teacher
              </button>
            </div>

            <Field label="Full name" name="name" type="text" autoComplete="name" error={state.fieldErrors?.name} />
            <Field label="Email address" name="email" type="email" autoComplete="email" error={state.fieldErrors?.email} />
            <Field
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              error={state.fieldErrors?.password}
              hint="At least 8 characters."
            />

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-highfive-blue text-white font-bold py-3.5 rounded-xl hover:bg-emerald-800 transition-colors disabled:opacity-60"
            >
              {pending ? "Creating account…" : "Create account"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-highfive-blue font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  error,
  hint,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
  error?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm"
      />
      {error ? (
        <p className="text-red-600 text-xs mt-1">{error}</p>
      ) : hint ? (
        <p className="text-slate-400 text-xs mt-1">{hint}</p>
      ) : null}
    </div>
  );
}
