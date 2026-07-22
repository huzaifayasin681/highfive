import { requireRole } from "@/lib/auth-helpers";
import { getUserPayments, formatPKR } from "@/lib/payments";
import PaymentList from "@/components/payments/PaymentList";

export const dynamic = "force-dynamic";

export default async function StudentPaymentsPage() {
  const user = await requireRole(["STUDENT", "ADMIN"]);
  const payments = await getUserPayments(user.id);

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Payments</h1>
        <p className="text-slate-500 mt-1">
          Your registration fee, tutor unlocks and session bookings.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Stat label="Total paid" value={formatPKR(totalPaid)} />
        <Stat label="Transactions" value={String(payments.length)} />
        <Stat
          label="Completed"
          value={String(payments.filter((p) => p.status === "paid").length)}
        />
      </div>

      <PaymentList payments={payments} emptyLabel="You haven't made any payments yet." />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="text-2xl font-extrabold text-slate-900">{value}</div>
      <div className="text-xs text-slate-400 mt-0.5">{label}</div>
    </div>
  );
}
