import { Plus, Trash2, Save } from "lucide-react";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { saveContentBlock, deleteContentBlock } from "@/app/admin/actions";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";

export const dynamic = "force-dynamic";

const SUGGESTED = [
  "home_hero_headline",
  "home_hero_subtitle",
  "about_mission",
  "faq_1_question",
  "faq_1_answer",
];

export default async function ContentPage() {
  await requireRole("ADMIN");
  const blocks = await prisma.contentBlock.findMany({ orderBy: { key: "asc" } });
  const existingKeys = new Set(blocks.map((b) => b.key));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Site Content</h1>
        <p className="text-slate-500 mt-1">Edit homepage, about and FAQ text without a deploy.</p>
      </div>

      {/* Add new block */}
      <form action={saveContentBlock} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
        <h2 className="font-bold text-slate-900 text-sm">Add / update a content block</h2>
        <input
          name="key"
          required
          list="suggested-keys"
          placeholder="Key (e.g. home_hero_subtitle)"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-mono"
        />
        <datalist id="suggested-keys">
          {SUGGESTED.filter((k) => !existingKeys.has(k)).map((k) => (
            <option key={k} value={k} />
          ))}
        </datalist>
        <textarea
          name="value"
          rows={3}
          placeholder="Content value…"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm resize-none"
        />
        <button className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors">
          <Plus className="w-4 h-4" /> Save block
        </button>
      </form>

      {/* Existing blocks */}
      {blocks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-400 text-sm">No content blocks yet. Add one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-2">
                <code className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">{b.key}</code>
                <form action={deleteContentBlock}>
                  <input type="hidden" name="key" value={b.key} />
                  <ConfirmSubmit
                    message={`Delete content block "${b.key}"?`}
                    className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </ConfirmSubmit>
                </form>
              </div>
              <form action={saveContentBlock} className="space-y-2">
                <input type="hidden" name="key" value={b.key} />
                <textarea
                  name="value"
                  rows={2}
                  defaultValue={b.value}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm resize-none"
                />
                <button className="flex items-center gap-1.5 text-xs font-semibold text-highfive-blue px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors">
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
