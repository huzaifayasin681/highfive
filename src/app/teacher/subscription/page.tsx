import { CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { requireRole } from "@/lib/auth-helpers";
import { getSubscription, getUserPayments, formatPKR, PRICES } from "@/lib/payments";
import { startSubscriptionPayment } from "@/app/checkout/actions";
import PaymentList from "@/components/payments/PaymentList";

export const dynamic = "force-dynamic";

export default async function TeacherSubscriptionPage() {
  const user = await requireRole(["TEACHER", "ADMIN"]);
  const [sub, payments] = await Promise.all([
    getSubscription(user.id),
    getUserPayments(user.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Subscription &amp; billing</h1>
        <p className="text-slate-500 mt-1">
          Your access to student leads and your payment history.
        </p>
      </div>

      {/* Status card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {sub.active ? (
              <CheckCircle2 className="w-10 h-10 text-success-green" />
            ) : (
              <XCircle className="w-10 h-10 text-slate-300" />
            )}
            <div>
              <div className="font-bold text-slate-900">
                {sub.active ? "Active subscription" : "No active subscription"}
              </div>
              <div className="text-sm text-slate-500">
                {sub.active && sub.expiresAt
                  ? `Renews / expires on ${sub.expiresAt.toLocaleDateString("en-PK", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}`
                  : "Subscribe to unlock student leads."}
              </div>
            </div>
          </div>

          <form action={startSubscriptionPayment}>
            <button
              type="submit"
              className="bg-highfive-blue text-white font-bold px-5 py-3 rounded-xl hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              {sub.active ? "Renew" : "Subscribe"} — {formatPKR(PRICES.TEACHER_SUBSCRIPTION)}
            </button>
          </form>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">Payment history</h2>
        <PaymentList payments={payments} emptyLabel="No payments yet." />
      </div>
    </div>
  );
}
