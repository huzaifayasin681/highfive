import { ScrollText } from "lucide-react";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ACTION_STYLE: Record<string, string> = {
  USER_SUSPENDED: "bg-amber-50 text-amber-700",
  USER_DELETED: "bg-rose-50 text-rose-700",
  USER_REACTIVATED: "bg-emerald-50 text-emerald-700",
  TEACHER_APPROVED: "bg-emerald-50 text-emerald-700",
  TEACHER_REJECTED: "bg-rose-50 text-rose-700",
  REVIEW_HIDDEN: "bg-amber-50 text-amber-700",
  REVIEW_DELETED: "bg-rose-50 text-rose-700",
  REQUIREMENT_DELETED: "bg-rose-50 text-rose-700",
};

export default async function AuditPage() {
  await requireRole("ADMIN");
  const logs = await prisma.auditLog.findMany({
    include: { actor: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Audit Log</h1>
        <p className="text-slate-500 mt-1">A record of key administrative actions.</p>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ScrollText className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm">No admin actions recorded yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
          {logs.map((l) => (
            <div key={l.id} className="flex items-center gap-3 p-4 text-sm">
              <span className={`text-[11px] font-bold px-2 py-1 rounded ${ACTION_STYLE[l.action] ?? "bg-slate-100 text-slate-600"}`}>
                {l.action}
              </span>
              <div className="flex-grow min-w-0">
                <span className="text-slate-600">
                  <span className="font-semibold text-slate-900">{l.actor.name}</span> · {l.targetType}
                  {l.detail ? ` · ${l.detail}` : ""}
                </span>
                <code className="block text-[11px] text-slate-400 truncate">{l.targetId}</code>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
                {l.createdAt.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
