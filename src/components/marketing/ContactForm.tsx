"use client";

import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { submitContact, type ContactState } from "@/app/contact/actions";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    submitContact,
    {}
  );

  if (state.ok) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">Message sent!</h3>
        <p className="text-slate-500 text-sm">Thanks for reaching out — our team will get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Your name" name="name" required />
        <Field label="Email address" name="email" type="email" required />
      </div>
      <Field label="Subject (optional)" name="subject" />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="How can we help?"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm resize-none"
        />
      </div>
      {state.error && <p className="text-red-600 text-sm">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-highfive-blue text-white font-bold py-3.5 rounded-xl hover:bg-emerald-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4" /> {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm"
      />
    </div>
  );
}
