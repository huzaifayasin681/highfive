import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Bell, GraduationCap, ClipboardList, Check, ArrowRight, CheckCheck } from "lucide-react";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getUserNotifications } from "@/lib/notifications";

export const dynamic = "force-dynamic";

function timeAgo(date: Date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function TeacherNotificationsPage() {
  const user = await requireRole(["TEACHER", "ADMIN"]);
  const notifications = await getUserNotifications(user.id);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1">
            Real-time alerts whenever a new student joins or requests tutoring.
          </p>
        </div>

        {unreadCount > 0 && (
          <form
            action={async () => {
              "use server";
              await prisma.notification.updateMany({
                where: { userId: user.id, read: false },
                data: { read: true },
              });
              revalidatePath("/teacher");
              revalidatePath("/teacher/notifications");
            }}
          >
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:text-highfive-blue hover:border-highfive-blue text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              <CheckCheck className="w-4 h-4" /> Mark all as read
            </button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-1">No notifications yet</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            You will be notified immediately whenever a new student arrives or posts a requirement.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {notifications.map((n) => {
            const isStudent = n.type === "NEW_STUDENT";
            return (
              <div
                key={n.id}
                className={`p-5 transition-colors flex items-start gap-4 ${
                  !n.read ? "bg-emerald-50/30" : "hover:bg-slate-50/60"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isStudent
                      ? "bg-emerald-100 text-highfive-blue"
                      : "bg-teal-100 text-teal-700"
                  }`}
                >
                  {isStudent ? (
                    <GraduationCap className="w-5 h-5" />
                  ) : (
                    <ClipboardList className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{n.title}</span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                    )}
                    <span className="text-xs text-slate-400 ml-auto flex-shrink-0">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    {n.message}
                  </p>

                  <div className="flex items-center gap-4">
                    {n.link && (
                      <Link
                        href={n.link}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-highfive-blue hover:underline"
                      >
                        Browse Leads <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}

                    {!n.read && (
                      <form
                        action={async () => {
                          "use server";
                          await prisma.notification.update({
                            where: { id: n.id },
                            data: { read: true },
                          });
                          revalidatePath("/teacher");
                          revalidatePath("/teacher/notifications");
                        }}
                      >
                        <button
                          type="submit"
                          className="text-xs text-slate-400 hover:text-slate-600 font-medium inline-flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Mark read
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
