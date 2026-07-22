import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth-helpers";
import { getThread } from "@/lib/messaging";
import MessageComposer from "@/components/MessageComposer";

export const dynamic = "force-dynamic";

function clock(date: Date) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default async function TeacherThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const user = await requireRole(["TEACHER", "ADMIN"]);
  const { threadId } = await params;
  const thread = await getThread(threadId, user.id);
  if (!thread) notFound();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[calc(100vh-12rem)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-100">
        <Link href="/teacher/messages" className="text-slate-400 hover:text-slate-700 lg:hidden">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-highfive-blue font-bold">
          {thread.other.name.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-slate-900 leading-tight">{thread.other.name}</p>
          <p className="text-xs text-slate-400 capitalize">{thread.other.role.toLowerCase()}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-50">
        {thread.messages.map((m) => {
          const mine = m.senderId === user.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  mine
                    ? "bg-highfive-blue text-white rounded-br-sm"
                    : "bg-white border border-slate-100 text-slate-700 rounded-bl-sm"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{m.content}</p>
                <p className={`text-[10px] mt-1 ${mine ? "text-emerald-200" : "text-slate-400"}`}>
                  {clock(m.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <MessageComposer threadId={threadId} />
    </div>
  );
}
