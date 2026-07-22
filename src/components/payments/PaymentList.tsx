import { Receipt } from "lucide-react";
import { formatPKR } from "@/lib/payments";

export type PaymentRow = {
  id: string;
  description: string;
  type: string;
  amount: number;
  status: string;
  method: string | null;
  reference: string;
  createdAt: Date;
  paidAt: Date | null;
  userName?: string;
  receiptUrl?: string | null;
};

const TYPE_LABELS: Record<string, string> = {
  REGISTRATION: "Registration",
  UNLOCK_TUTOR: "Unlock tutor",
  SESSION_BOOKING: "Session",
  TEACHER_SUBSCRIPTION: "Subscription",
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: "bg-emerald-50 text-success-green border-emerald-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    under_review: "bg-blue-50 text-blue-600 border-blue-100",
    failed: "bg-rose-50 text-rose-600 border-rose-100",
  };
  return (
    <span
      className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border capitalize ${
        styles[status] ?? "bg-slate-50 text-slate-500 border-slate-100"
      }`}
    >
      {status}
    </span>
  );
}

function methodLabel(method: string | null): string {
  if (method === "jazzcash") return "JazzCash";
  if (method === "easypaisa") return "EasyPaisa";
  return "—";
}

export default function PaymentList({
  payments,
  showUser = false,
  isAdmin = false,
  emptyLabel = "No payments yet.",
}: {
  payments: PaymentRow[];
  showUser?: boolean;
  isAdmin?: boolean;
  emptyLabel?: string;
}) {
  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Receipt className="w-6 h-6 text-slate-300" />
        </div>
        <p className="text-slate-500 text-sm">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wide border-b border-slate-100">
              <th className="px-5 py-3 font-semibold">Description</th>
              {showUser && <th className="px-5 py-3 font-semibold">Payer</th>}
              <th className="px-5 py-3 font-semibold">Type</th>
              <th className="px-5 py-3 font-semibold">Method</th>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Receipt</th>
              <th className="px-5 py-3 font-semibold text-right">Amount</th>
              {isAdmin && <th className="px-5 py-3 font-semibold text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60">
                <td className="px-5 py-3.5">
                  <div className="font-semibold text-slate-800">{p.description}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{p.reference}</div>
                </td>
                {showUser && (
                  <td className="px-5 py-3.5 text-slate-600">{p.userName ?? "—"}</td>
                )}
                <td className="px-5 py-3.5">
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                    {TYPE_LABELS[p.type] ?? p.type}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-600">{methodLabel(p.method)}</td>
                <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                  {(p.paidAt ?? p.createdAt).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-5 py-3.5 text-slate-500 text-xs">
                  {p.receiptUrl ? (
                    <a href={p.receiptUrl} target="_blank" rel="noreferrer" className="text-highfive-blue hover:underline">
                      View Receipt
                    </a>
                  ) : "—"}
                </td>
                <td className="px-5 py-3.5 text-right font-bold text-slate-900 whitespace-nowrap">
                  {formatPKR(p.amount)}
                </td>
                {isAdmin && (
                  <td className="px-5 py-3.5 text-right">
                    {p.status === "under_review" && (
                      <form action={async (formData) => {
                        "use server";
                        const { approvePayment } = await import("@/app/admin/payments/actions");
                        await approvePayment(formData);
                      }}>
                        <input type="hidden" name="paymentId" value={p.id} />
                        <button type="submit" className="bg-success-green text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-emerald-700">
                          Approve
                        </button>
                      </form>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
