import Link from "next/link";
import { Users, GraduationCap, ClipboardList, MessageSquare, Star, ShieldAlert } from "lucide-react";
import { requireRole } from "@/lib/auth-helpers";
import { getPlatformStats, getSignupSeries } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const user = await requireRole("ADMIN");
  const [stats, series] = await Promise.all([getPlatformStats(), getSignupSeries(14)]);
  const maxCount = Math.max(1, ...series.map((s) => s.count));

  const cards = [
    { label: "Students", value: stats.students, icon: Users, color: "bg-emerald-50 text-highfive-blue" },
    { label: "Teachers", value: stats.teachers, icon: GraduationCap, color: "bg-emerald-50 text-emerald-600" },
    { label: "Requirements", value: stats.requirements, icon: ClipboardList, color: "bg-teal-50 text-teal-600" },
    { label: "Messages", value: stats.messages, icon: MessageSquare, color: "bg-cyan-50 text-cyan-600" },
    { label: "Reviews", value: stats.reviews, icon: Star, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Platform Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back, {user.name?.split(" ")[0]}. Here&apos;s how HighFive is doing.</p>
      </div>

      {stats.pendingTeachers > 0 && (
        <Link
          href="/admin/verification"
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-5 py-4 hover:bg-amber-100 transition-colors"
        >
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold">
            {stats.pendingTeachers} teacher{stats.pendingTeachers !== 1 ? "s" : ""} awaiting verification
          </span>
          <span className="ml-auto text-sm font-bold">Review →</span>
        </Link>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className={`w-10 h-10 ${c.color} rounded-xl flex items-center justify-center mb-3`}>
              <c.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{c.value}</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Signups chart */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 mb-1">Signups over time</h2>
        <p className="text-xs text-slate-400 mb-6">New accounts created in the last 14 days</p>
        <div className="flex items-end gap-1.5 h-40">
          {series.map((s) => (
            <div key={s.date} className="flex-1 flex flex-col items-center justify-end h-full group">
              <div className="text-[10px] font-bold text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {s.count}
              </div>
              <div
                className="w-full bg-gradient-to-t from-highfive-blue to-teal-500 rounded-t-md min-h-[2px] transition-all"
                style={{ height: `${(s.count / maxCount) * 100}%` }}
                title={`${s.label}: ${s.count}`}
              />
              <div className="text-[9px] text-slate-400 mt-1.5 rotate-45 origin-left whitespace-nowrap h-4">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
