"use client";

import { useActionState } from "react";
import { updateStudentSettings, type ActionState } from "@/app/student/actions";

export default function SettingsForm({
  name,
  email,
  phone,
  location,
}: {
  name: string;
  email: string;
  phone: string;
  location: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateStudentSettings,
    {}
  );

  return (
    <form action={formAction} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 max-w-xl">
      <Field label="Full name" name="name" defaultValue={name} required />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
        <input
          value={email}
          disabled
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-sm"
        />
        <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
      </div>
      <Field label="Phone (optional)" name="phone" defaultValue={phone} placeholder="03xx-xxxxxxxx" />
      <Field label="Location (optional)" name="location" defaultValue={location} placeholder="e.g. Karachi" />

      {state.error && <p className="text-red-600 text-sm">{state.error}</p>}
      {state.ok && <p className="text-emerald-600 text-sm">Saved!</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-highfive-blue text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-emerald-800 transition-colors disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm"
      />
    </div>
  );
}
