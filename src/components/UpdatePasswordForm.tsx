"use client";

import { useActionState } from "react";
import { updatePassword, type PasswordActionState } from "@/app/actions";

export default function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState<PasswordActionState, FormData>(
    updatePassword,
    {}
  );

  return (
    <form action={formAction} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm"
          placeholder="Enter new password"
        />
      </div>

      {state.error && <p className="text-red-600 text-sm">{state.error}</p>}
      {state.ok && <p className="text-emerald-600 text-sm">Password updated successfully!</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-slate-900 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
      >
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
