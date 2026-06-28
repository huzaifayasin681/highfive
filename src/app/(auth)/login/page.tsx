"use client";

import Link from "next/link";
import { useActionState } from "react";
import { GraduationCap } from "lucide-react";
import { loginAction, type AuthFormState } from "../actions";

const initialState: AuthFormState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-highfive-blue to-teal-700 px-8 pt-8 pb-6 text-white">
            <div className="flex items-center gap-2.5 mb-3">
              <GraduationCap className="w-6 h-6" />
              <span className="font-extrabold text-lg">HighFive Tutors</span>
            </div>
            <h1 className="text-2xl font-extrabold">Welcome back</h1>
            <p className="text-emerald-200 text-sm mt-1">Log in to your account.</p>
          </div>

          <form action={formAction} className="p-8 space-y-4">
            {state.error && (
              <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 border border-red-100">
                {state.error}
              </div>
            )}

            <Field
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              error={state.fieldErrors?.email}
            />
            <Field
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              error={state.fieldErrors?.password}
            />

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-highfive-blue text-white font-bold py-3.5 rounded-xl hover:bg-emerald-800 transition-colors disabled:opacity-60"
            >
              {pending ? "Logging in…" : "Log in"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-highfive-blue font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Demo accounts (password <span className="font-mono">password123</span>):
          admin@ / teacher@ / student@highfive.test
        </p>
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
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
  error?: string;
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
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}
