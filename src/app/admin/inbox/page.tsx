import { Mail, MailOpen, Trash2, Inbox } from "lucide-react";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { setContactRead, deleteContactMessage } from "@/app/admin/actions";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";

export const dynamic = "force-dynamic";

export default async function AdminInboxPage() {
  await requireRole("ADMIN");
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Inbox</h1>
        <p className="text-slate-500 mt-1">
          Contact form submissions{unread > 0 ? ` · ${unread} unread` : ""}.
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`bg-white rounded-2xl border shadow-sm p-5 ${
                m.read ? "border-slate-100" : "border-highfive-blue/30 bg-emerald-50/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {!m.read && <span className="w-2 h-2 rounded-full bg-highfive-blue flex-shrink-0" />}
                    <span className="font-bold text-slate-900">{m.name}</span>
                    <a href={`mailto:${m.email}`} className="text-xs text-highfive-blue hover:underline">
                      {m.email}
                    </a>
                    <span className="text-xs text-slate-400">· {m.createdAt.toLocaleString()}</span>
                  </div>
                  {m.subject && <p className="text-sm font-semibold text-slate-700 mt-1">{m.subject}</p>}
                  <p className="text-slate-600 text-sm mt-1 whitespace-pre-line">{m.message}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <form action={setContactRead}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="read" value={(!m.read).toString()} />
                    <button className="flex items-center gap-1 text-xs font-semibold border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                      {m.read ? <><Mail className="w-3.5 h-3.5" /> Unread</> : <><MailOpen className="w-3.5 h-3.5" /> Read</>}
                    </button>
                  </form>
                  <form action={deleteContactMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <ConfirmSubmit message="Delete this message?" className="flex items-center gap-1 text-xs font-semibold border border-rose-200 text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
