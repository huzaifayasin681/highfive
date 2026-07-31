"use client";

import Link from "next/link";
import { useActionState } from "react";
import { GraduationCap, ArrowLeft, CheckCircle2 } from "lucide-react";
import { forgotPasswordAction, resetPasswordWithRequestAction, type AuthFormState } from "../actions";

const initialState: AuthFormState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(
    (state: AuthFormState, payload: FormData) => 
      state.step === "NEW_PASSWORD" ? resetPasswordWithRequestAction(state, payload) : forgotPasswordAction(state, payload), 
    initialState
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-highfive-blue to-teal-700 px-8 pt-8 pb-6 text-white">
            <Link href="/login" className="inline-flex items-center gap-1 text-xs text-emerald-100 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to login
            </Link>
            <div className="flex items-center gap-2.5 mb-3">
              <GraduationCap className="w-6 h-6" />
              <span className="font-extrabold text-lg">HighFive Tutors</span>
            </div>
            <h1 className="text-2xl font-extrabold">Reset Password</h1>
            <p className="text-emerald-200 text-sm mt-1">
              {state.step === "NEW_PASSWORD" ? "Enter your new password below." : "Enter your email to request a reset from the admin."}
            </p>
          </div>

          <form action={formAction as unknown as string} className="p-8 space-y-4">
            {state.error && (
              <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 border border-red-100">
                {state.error}
              </div>
            )}
            
            {state.step === "DONE" ? (
              <div className="bg-emerald-50 text-emerald-700 text-sm rounded-xl px-4 py-4 border border-emerald-100 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                <p className="font-bold mb-1">Success!</p>
                <p>{state.message}</p>
                <Link href="/login" className="inline-block mt-2 bg-highfive-blue text-white font-bold py-2 px-6 rounded-xl hover:bg-emerald-800 transition-colors">
                  Go to Login
                </Link>
              </div>
            ) : state.step === "NEW_PASSWORD" ? (
              <>
                <input type="hidden" name="email" value={state.email} />
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm"
                  />
                  {state.fieldErrors?.newPassword && (
                    <p className="text-red-600 text-xs mt-1">{state.fieldErrors.newPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className="w-full bg-highfive-blue text-white font-bold py-3.5 rounded-xl hover:bg-emerald-800 transition-colors disabled:opacity-60"
                >
                  {pending ? "Saving..." : "Save new password"}
                </button>
              </>
            ) : state.ok ? (
              <div className="bg-emerald-50 text-emerald-700 text-sm rounded-xl px-4 py-4 border border-emerald-100 text-center">
                <p className="font-bold mb-1">Request Sent</p>
                <p>{state.message}</p>
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm"
                  />
                  {state.fieldErrors?.email && (
                    <p className="text-red-600 text-xs mt-1">{state.fieldErrors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  className="w-full bg-highfive-blue text-white font-bold py-3.5 rounded-xl hover:bg-emerald-800 transition-colors disabled:opacity-60"
                >
                  {pending ? "Sending..." : "Send reset link"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
