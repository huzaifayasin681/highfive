import Link from "next/link";
import { ClipboardList, MessageSquare, Star, Search, ArrowRight } from "lucide-react";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getThreadsForUser } from "@/lib/messaging";

export const dynamic = "force-dynamic";

export default async function StudentOverview() {
  const user = await requireRole(["STUDENT", "ADMIN"]);

  const [openReqs, totalReqs, reviewsGiven, threads] = await Promise.all([
    prisma.requirement.count({ where: { studentId: user.id, status: "open" } }),
    prisma.requirement.count({ where: { studentId: user.id } }),
    prisma.review.count({ where: { authorId: user.id } }),
    getThreadsForUser(user.id),
  ]);
  const unread = threads.reduce((s, t) => s + t.unread, 0);

  const stats = [
    { label: "Open requirements", value: openReqs, sub: `${totalReqs} total`, icon: ClipboardList, href: "/student/requirements", color: "bg-emerald-50 text-highfive-blue" },
    { label: "Conversations", value: threads.length, sub: unread > 0 ? `${unread} unread` : "all caught up", icon: MessageSquare, href: "/student/messages", color: "bg-emerald-50 text-emerald-600" },
    { label: "Reviews given", value: reviewsGiven, sub: "thank you!", icon: Star, href: "/student/reviews", color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Welcome back, {user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">Here&apos;s a snapshot of your learning journey.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 card-hover group"
          >
            <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center mb-4`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{s.value}</div>
            <div className="text-sm font-semibold text-slate-700 mt-1">{s.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link
          href="/student/requirements?new=1"
          className="bg-gradient-to-br from-highfive-blue to-teal-700 text-white rounded-2xl p-6 flex items-center justify-between card-hover"
        >
          <div>
            <h3 className="font-bold text-lg">Post a requirement</h3>
            <p className="text-emerald-100 text-sm mt-1">Tell tutors what you want to learn.</p>
          </div>
          <ArrowRight className="w-6 h-6" />
        </Link>
        <Link
          href="/search"
          className="bg-white border border-slate-100 shadow-sm text-slate-900 rounded-2xl p-6 flex items-center justify-between card-hover"
        >
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Search className="w-5 h-5 text-highfive-blue" /> Browse tutors
            </h3>
            <p className="text-slate-500 text-sm mt-1">Find verified tutors across Pakistan.</p>
          </div>
          <ArrowRight className="w-6 h-6 text-slate-400" />
        </Link>
      </div>
    </div>
  );
}
