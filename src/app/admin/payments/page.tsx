import { Wallet, TrendingUp, Users, CreditCard } from "lucide-react";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { formatPKR } from "@/lib/payments";
import PaymentList, { type PaymentRow } from "@/components/payments/PaymentList";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  REGISTRATION: "Registration fees",
  UNLOCK_TUTOR: "Tutor unlocks",
  SESSION_BOOKING: "Session bookings",
  TEACHER_SUBSCRIPTION: "Teacher subscriptions",
};

export default async function AdminPaymentsPage() {
  await requireRole("ADMIN");

  const rows = await prisma.payment.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const paid = rows.filter((r) => r.status === "paid");
  const revenue = paid.reduce((sum, r) => sum + r.amount, 0);

  // Revenue broken down by type.
  const byType = new Map<string, number>();
  for (const r of paid) {
    byType.set(r.type, (byType.get(r.type) ?? 0) + r.amount);
  }

  const stats = [
    { label: "Total revenue", value: formatPKR(revenue), icon: Wallet, color: "bg-emerald-50 text-success-green" },
    { label: "Paid transactions", value: String(paid.length), icon: CreditCard, color: "bg-blue-50 text-highfive-blue" },
    { label: "Pending / failed", value: String(rows.length - paid.length), icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
    { label: "Paying users", value: String(new Set(paid.map((r) => r.userId)).size), icon: Users, color: "bg-violet-50 text-violet-600" },
  ];

  const payments: PaymentRow[] = rows.map((r) => ({
    id: r.id,
    description: r.description,
    type: r.type,
    amount: r.amount,
    status: r.status,
    method: r.method,
    reference: r.reference,
    createdAt: r.createdAt,
    paidAt: r.paidAt,
    userName: r.user.name,
    receiptUrl: r.receiptUrl,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Payments</h1>
        <p className="text-slate-500 mt-1">Revenue and transactions across the platform.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {byType.size > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Revenue by category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...byType.entries()].map(([type, amount]) => (
              <div key={type} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-lg font-extrabold text-slate-900">{formatPKR(amount)}</div>
                <div className="text-xs text-slate-400 mt-0.5">{TYPE_LABELS[type] ?? type}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <PaymentList payments={payments} showUser isAdmin emptyLabel="No payments recorded yet." />
    </div>
  );
}
