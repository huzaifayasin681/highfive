import { Search, Ban, CheckCircle2, Trash2 } from "lucide-react";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { setUserStatus, deleteUser } from "@/app/admin/actions";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";

export const dynamic = "force-dynamic";

const ROLE_TABS = ["ALL", "STUDENT", "TEACHER", "ADMIN"] as const;

const ROLE_BADGE: Record<string, string> = {
  STUDENT: "bg-emerald-50 text-highfive-blue border-emerald-100",
  TEACHER: "bg-emerald-50 text-emerald-600 border-emerald-100",
  ADMIN: "bg-slate-100 text-slate-700 border-slate-200",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string }>;
}) {
  const admin = await requireRole("ADMIN");
  const { q = "", role = "ALL" } = await searchParams;

  const users = await prisma.user.findMany({
    where: {
      ...(role !== "ALL" ? { role } : {}),
      ...(q
        ? { OR: [{ name: { contains: q } }, { email: { contains: q } }] }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">User Management</h1>
        <p className="text-slate-500 mt-1">Search, suspend or remove any account.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {ROLE_TABS.map((t) => (
            <a
              key={t}
              href={`/admin/users?role=${t}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                role === t ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {t}
            </a>
          ))}
        </div>
        <form className="relative flex-grow">
          <input type="hidden" name="role" value={role} />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name or email…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
          />
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => {
                const isSelf = u.id === admin.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-slate-900">{u.name}</div>
                      <div className="text-xs text-slate-400">{u.email}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${ROLE_BADGE[u.role] ?? ""}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          u.status === "active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {isSelf ? (
                          <span className="text-xs text-slate-400">that&apos;s you</span>
                        ) : (
                          <>
                            <form action={setUserStatus}>
                              <input type="hidden" name="id" value={u.id} />
                              <input type="hidden" name="status" value={u.status === "active" ? "suspended" : "active"} />
                              <button
                                type="submit"
                                className="flex items-center gap-1 text-xs font-semibold border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                              >
                                {u.status === "active" ? (
                                  <>
                                    <Ban className="w-3.5 h-3.5 text-amber-600" /> Suspend
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Reactivate
                                  </>
                                )}
                              </button>
                            </form>
                            <form action={deleteUser}>
                              <input type="hidden" name="id" value={u.id} />
                              <ConfirmSubmit
                                message={`Permanently delete ${u.name}? This removes all their data.`}
                                className="flex items-center gap-1 text-xs font-semibold border border-rose-200 text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </ConfirmSubmit>
                            </form>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
