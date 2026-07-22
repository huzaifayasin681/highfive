import Link from "next/link";
import { MessageSquare, ChevronRight, Inbox } from "lucide-react";
import { requireRole } from "@/lib/auth-helpers";
import { getThreadsForUser } from "@/lib/messaging";

export const dynamic = "force-dynamic";

function timeAgo(date: Date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function TeacherMessagesPage() {
  const user = await requireRole(["TEACHER", "ADMIN"]);
  const threads = await getThreadsForUser(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Messages</h1>
        <p className="text-slate-500 mt-1">Your conversations with students.</p>
      </div>

      {threads.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">No conversations yet</h3>
          <p className="text-slate-500 text-sm mb-5">
            Students who unlock your contact can message you here.
          </p>
          <Link
            href="/teacher/leads"
            className="inline-flex items-center gap-2 bg-highfive-blue text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-800 transition-colors"
          >
            <Inbox className="w-4 h-4" /> Browse student leads
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {threads.map((t) => (
            <Link
              key={t.threadId}
              href={`/teacher/messages/${t.threadId}`}
              className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-highfive-blue font-bold flex-shrink-0">
                {t.otherUser.name.charAt(0)}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 truncate">{t.otherUser.name}</span>
                  <span className="text-xs text-slate-400 flex-shrink-0">{timeAgo(t.lastAt)}</span>
                </div>
                <p className="text-sm text-slate-500 truncate">{t.lastMessage}</p>
              </div>
              {t.unread > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold rounded-full px-2 py-0.5 flex-shrink-0">
                  {t.unread}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
