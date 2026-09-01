"use client";

import { useActionState, useState } from "react";
import { Tag, Loader2 } from "lucide-react";
import { applyPromoCode, type PromoState } from "@/app/checkout/actions";

const initial: PromoState = {};

export default function PromoCodeForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(applyPromoCode, initial);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-highfive-blue hover:underline"
      >
        <Tag className="w-3.5 h-3.5" /> Have a promo code?
      </button>
    );
  }

  return (
    <form action={formAction} className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 space-y-3">
      <label htmlFor="code" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
        <Tag className="w-3.5 h-3.5" /> Promo code
      </label>
      <div className="flex gap-2">
        <input
          id="code"
          name="code"
          type="text"
          required
          placeholder="e.g. FIRST50"
          className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm uppercase placeholder:normal-case"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 bg-highfive-blue text-white font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-800 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
        </button>
      </div>
      {state.error && <p className="text-red-600 text-xs">{state.error}</p>}
      <p className="text-slate-400 text-xs">
        Valid for the first 50 students to join — makes registration free.
      </p>
    </form>
  );
}
