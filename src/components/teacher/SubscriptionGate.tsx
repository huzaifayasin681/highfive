import { Inbox, Check, Sparkles } from "lucide-react";
import { startSubscriptionPayment } from "@/app/checkout/actions";

const PERKS = [
  "Unlimited access to live student leads",
  "Contact students directly and win new tuitions",
  "Priority placement in the tutor directory",
  "30 days of access, renewable anytime",
];

export default function SubscriptionGate({ price }: { price: number }) {
  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-highfive-blue to-teal-700 p-8 text-white">
          <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mb-4">
            <Inbox className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold">Unlock student leads</h1>
          <p className="text-emerald-100 text-sm mt-1">
            Subscribe to browse and respond to students looking for tutors like you.
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold text-slate-900">
              Rs {price.toLocaleString()}
            </span>
            <span className="text-slate-400 font-medium mb-1">/ 30 days</span>
          </div>

          <ul className="space-y-3">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-slate-700">
                <span className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-success-green" />
                </span>
                <span className="text-sm font-medium">{perk}</span>
              </li>
            ))}
          </ul>

          <form action={startSubscriptionPayment}>
            <button
              type="submit"
              className="w-full bg-highfive-blue text-white font-bold py-3.5 rounded-xl hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Subscribe for Rs {price.toLocaleString()}
            </button>
          </form>
          <p className="text-center text-xs text-slate-400">
            Pay securely via JazzCash or EasyPaisa. This is a simulated gateway.
          </p>
        </div>
      </div>
    </div>
  );
}
