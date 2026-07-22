"use client";

import { useActionState, useState } from "react";
import { Smartphone, ShieldCheck, Lock, Loader2 } from "lucide-react";
import { confirmPayment, type CheckoutState } from "@/app/checkout/actions";

const initial: CheckoutState = {};

const METHODS = [
  {
    id: "jazzcash",
    name: "JazzCash",
    tag: "Mobile Account",
    accent: "from-red-600 to-rose-700",
    ring: "ring-red-500",
  },
  {
    id: "easypaisa",
    name: "EasyPaisa",
    tag: "Mobile Account",
    accent: "from-green-600 to-emerald-700",
    ring: "ring-green-500",
  },
] as const;

export default function PaymentGateway({
  paymentId,
  amountLabel,
  description,
}: {
  paymentId: string;
  amountLabel: string;
  description: string;
}) {
  const [method, setMethod] = useState<"jazzcash" | "easypaisa">("jazzcash");
  const [state, formAction, pending] = useActionState(confirmPayment, initial);
  const active = METHODS.find((m) => m.id === method)!;

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="paymentId" value={paymentId} />
      <input type="hidden" name="method" value={method} />

      {state.error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 border border-red-100">
          {state.error}
        </div>
      )}

      {/* Order summary */}
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">{description}</span>
          <span className="font-extrabold text-slate-900">{amountLabel}</span>
        </div>
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200">
          <span className="text-sm font-semibold text-slate-700">Total payable</span>
          <span className="text-xl font-extrabold text-highfive-blue">{amountLabel}</span>
        </div>
      </div>

      {/* Method selector */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2">Pay with</p>
        <div className="grid grid-cols-2 gap-3">
          {METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                method === m.id
                  ? `border-transparent ring-2 ${m.ring} bg-white shadow-sm`
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <span
                className={`w-9 h-9 rounded-lg bg-gradient-to-br ${m.accent} text-white flex items-center justify-center flex-shrink-0`}
              >
                <Smartphone className="w-4 h-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-slate-900">{m.name}</span>
                <span className="block text-[11px] text-slate-400">{m.tag}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Wallet credentials */}
      <div className="space-y-4">
        <div>
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-slate-700 mb-1.5">
            {active.name} mobile number
          </label>
          <input
            id="mobileNumber"
            name="mobileNumber"
            type="tel"
            inputMode="numeric"
            required
            placeholder="03001234567"
            maxLength={11}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm"
          />
        </div>
        <div>
          <label htmlFor="receipt" className="block text-sm font-medium text-slate-700 mb-1.5">
            Upload Payment Screenshot / Receipt
          </label>
          <input
            id="receipt"
            name="receipt"
            type="file"
            accept="image/*"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm bg-white"
          />
          <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Admin will review and approve your request.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-highfive-blue text-white font-bold py-3.5 rounded-xl hover:bg-emerald-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
          </>
        ) : (
          <>Submit Receipt</>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-success-green" />
        Secured by HighFive Pay
      </div>
    </form>
  );
}
