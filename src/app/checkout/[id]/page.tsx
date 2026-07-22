import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, GraduationCap, ArrowRight, Receipt } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { PAYMENT_TYPES, formatPKR } from "@/lib/payments";
import PaymentGateway from "@/components/checkout/PaymentGateway";

export const dynamic = "force-dynamic";

function continueDestination(type: string, targetId: string | null): {
  href: string;
  label: string;
} {
  switch (type) {
    case PAYMENT_TYPES.REGISTRATION:
      return { href: "/student", label: "Go to my dashboard" };
    case PAYMENT_TYPES.UNLOCK_TUTOR:
      return { href: targetId ? `/tutors/${targetId}` : "/search", label: "Message your tutor" };
    case PAYMENT_TYPES.SESSION_BOOKING:
      return { href: "/student/payments", label: "View my payments" };
    case PAYMENT_TYPES.TEACHER_SUBSCRIPTION:
      return { href: "/teacher/leads", label: "Browse student leads" };
    default:
      return { href: "/", label: "Continue" };
  }
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const payment = await prisma.payment.findUnique({ where: { id } });
  if (!payment || payment.userId !== user.id) notFound();

  const amountLabel = formatPKR(payment.amount);
  const paid = payment.status === "paid";
  const dest = continueDestination(payment.type, payment.targetId);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-highfive-blue to-teal-700 px-8 pt-8 pb-6 text-white">
            <div className="flex items-center gap-2.5 mb-3">
              <GraduationCap className="w-6 h-6" />
              <span className="font-extrabold text-lg">HighFive Pay</span>
            </div>
            <h1 className="text-2xl font-extrabold">
              {paid ? "Payment successful" : "Complete your payment"}
            </h1>
            <p className="text-emerald-200 text-sm mt-1">{payment.description}</p>
          </div>

          <div className="p-8">
            {paid ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-9 h-9 text-success-green" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">{amountLabel}</div>
                  <p className="text-slate-500 text-sm mt-1">Paid successfully</p>
                </div>

                <dl className="rounded-xl border border-slate-100 bg-slate-50 divide-y divide-slate-100 text-sm">
                  <Row label="Transaction ref" value={payment.reference} />
                  <Row label="Method" value={methodLabel(payment.method)} />
                  {payment.mobileNumber && <Row label="Account" value={payment.mobileNumber} />}
                  <Row
                    label="Date"
                    value={(payment.paidAt ?? payment.createdAt).toLocaleString("en-PK")}
                  />
                </dl>

                <Link
                  href={dest.href}
                  className="w-full bg-highfive-blue text-white font-bold py-3.5 rounded-xl hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
                >
                  {dest.label} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/student/payments"
                  className="w-full text-slate-500 text-sm font-semibold py-2 rounded-xl hover:text-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Receipt className="w-4 h-4" /> View all receipts
                </Link>
              </div>
            ) : (
              <PaymentGateway
                paymentId={payment.id}
                amountLabel={amountLabel}
                description={payment.description}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-800">{value}</dd>
    </div>
  );
}

function methodLabel(method: string | null): string {
  if (method === "jazzcash") return "JazzCash";
  if (method === "easypaisa") return "EasyPaisa";
  return "—";
}
