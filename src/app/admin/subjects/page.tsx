import { Plus, Trash2 } from "lucide-react";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { createSubject, renameSubject, deleteSubject } from "@/app/admin/actions";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";

export const dynamic = "force-dynamic";

export default async function SubjectsPage() {
  await requireRole("ADMIN");
  const subjects = await prisma.subject.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { teachers: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Subjects</h1>
        <p className="text-slate-500 mt-1">Manage the subject list used across filters and profiles.</p>
      </div>

      {/* Add */}
      <form action={createSubject} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-3">
        <input
          name="name"
          required
          placeholder="Add a new subject (e.g. SAT Prep)"
          className="flex-grow px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
        />
        <button className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors">
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
        {subjects.map((s) => (
          <div key={s.id} className="flex items-center gap-3 p-3">
            <form action={renameSubject} className="flex-grow flex items-center gap-2">
              <input type="hidden" name="id" value={s.id} />
              <input
                name="name"
                defaultValue={s.name}
                className="flex-grow px-3 py-2 rounded-lg border border-transparent hover:border-slate-200 focus:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 text-sm font-medium text-slate-900 transition-colors"
              />
              <span className="text-xs text-slate-400 whitespace-nowrap">{s._count.teachers} teachers</span>
              <button className="text-xs font-semibold text-highfive-blue px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors">
                Save
              </button>
            </form>
            <form action={deleteSubject}>
              <input type="hidden" name="id" value={s.id} />
              <ConfirmSubmit
                message={`Delete "${s.name}"? It will be removed from all teacher profiles.`}
                className="flex items-center gap-1 text-xs font-semibold text-rose-600 border border-rose-200 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </ConfirmSubmit>
            </form>
          </div>
        ))}
        {subjects.length === 0 && (
          <p className="p-6 text-center text-slate-400 text-sm">No subjects yet.</p>
        )}
      </div>
    </div>
  );
}
