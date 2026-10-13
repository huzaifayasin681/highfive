import Link from "next/link";
import { Inbox, Star, UserCog, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Bell, GraduationCap, ClipboardList } from "lucide-react";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { computeCompletion } from "@/lib/teacher";

export const dynamic = "force-dynamic";

const VERIFICATION_BADGE: Record<string, { label: string; cls: string }> = {
  approved: { label: "Verified & listed", cls: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  pending: { label: "Pending verification", cls: "bg-amber-50 text-amber-600 border-amber-100" },
  rejected: { label: "Verification rejected", cls: "bg-rose-50 text-rose-600 border-rose-100" },
};

export default async function TeacherOverview() {
  const user = await requireRole(["TEACHER", "ADMIN"]);

  const [profile, openLeads, reviewsCount, unreadNotifications, recentNotifications] = await Promise.all([
    prisma.teacherProfile.findUnique({
      where: { userId: user.id },
      include: { subjects: { select: { name: true } } },
    }),
    prisma.requirement.count({ where: { status: "open" } }),
    prisma.review.count({ where: { targetId: user.id, hidden: false } }),
    prisma.notification.count({ where: { userId: user.id, read: false } }),
    prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const completion = computeCompletion(profile);
  const badge = VERIFICATION_BADGE[profile?.verificationStatus ?? "pending"] ?? VERIFICATION_BADGE.pending;

  const stats = [
    { label: "Notifications", value: unreadNotifications, sub: unreadNotifications > 0 ? `${unreadNotifications} unread alerts` : "all caught up", icon: Bell, href: "/teacher/notifications", color: "bg-amber-50 text-amber-600" },
    { label: "Student leads", value: openLeads, sub: "open requirements", icon: Inbox, href: "/teacher/leads", color: "bg-emerald-50 text-emerald-600" },
    { label: "Reviews", value: reviewsCount, sub: profile?.rating ? `${profile.rating}★ average` : "no rating yet", icon: Star, href: "/teacher/reviews", color: "bg-teal-50 text-teal-600" },
    { label: "Profile", value: `${completion.percent}%`, sub: "complete", icon: UserCog, href: "/teacher/profile", color: "bg-emerald-50 text-highfive-blue" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Welcome, {user.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1">Manage your tutoring profile and connect with new students.</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${badge.cls}`}>
          <ShieldCheck className="w-3.5 h-3.5" /> {badge.label}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 card-hover">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
            <div className="text-sm font-semibold text-slate-700 mt-1">{s.label}</div>
            <div className="text-xs text-slate-400 mt-0.5 truncate">{s.sub}</div>
          </Link>
        ))}
      </div>

      {recentNotifications.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Bell className="w-4 h-4 text-highfive-blue" />
              <span>Recent Student Alerts</span>
            </div>
            <Link
              href="/teacher/notifications"
              className="text-xs font-bold text-highfive-blue hover:underline"
            >
              View all ({unreadNotifications} unread) →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentNotifications.map((n) => (
              <div key={n.id} className="py-3 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.type === "NEW_STUDENT" ? "bg-emerald-100 text-highfive-blue" : "bg-teal-100 text-teal-700"}`}>
                  {n.type === "NEW_STUDENT" ? <GraduationCap className="w-4 h-4" /> : <ClipboardList className="w-4 h-4" />}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-xs text-slate-900 truncate">{n.title}</p>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completion meter */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900">Profile completion</h2>
          <span className="text-sm font-bold text-highfive-blue">{completion.percent}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-gradient-to-r from-highfive-blue to-teal-600 rounded-full transition-all"
            style={{ width: `${completion.percent}%` }}
          />
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {completion.items.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-sm">
              {item.done ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />
              )}
              <span className={item.done ? "text-slate-600" : "text-slate-400"}>{item.label}</span>
            </li>
          ))}
        </ul>
        {completion.percent < 100 && (
          <Link
            href="/teacher/profile"
            className="mt-5 inline-flex items-center gap-2 bg-highfive-blue text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-800 transition-colors"
          >
            Complete your profile <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
