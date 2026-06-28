import { Star, EyeOff, Eye, Trash2, Lock, RotateCcw } from "lucide-react";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { setReviewHidden, deleteReview, moderateRequirement } from "@/app/admin/actions";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";

export const dynamic = "force-dynamic";

export default async function ModerationPage() {
  await requireRole("ADMIN");

  const [reviews, requirements] = await Promise.all([
    prisma.review.findMany({
      include: {
        author: { select: { name: true } },
        target: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.requirement.findMany({
      include: { student: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Content Moderation</h1>
        <p className="text-slate-500 mt-1">Hide or remove reviews and requirements that violate policy.</p>
      </div>

      {/* Reviews */}
      <section>
        <h2 className="font-bold text-slate-900 mb-3">Reviews ({reviews.length})</h2>
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className={`bg-white rounded-2xl border shadow-sm p-5 ${
                r.hidden ? "border-rose-200 opacity-70" : "border-slate-100"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-slate-700">{r.author.name}</span> → {r.target.name}
                    <span className="flex items-center gap-0.5 ml-1 text-amber-500">
                      {r.rating} <Star className="w-3 h-3 fill-current" />
                    </span>
                    {r.hidden && <span className="text-rose-500 font-bold ml-1">HIDDEN</span>}
                  </div>
                  <p className="text-slate-600 text-sm">{r.comment || <span className="italic text-slate-400">No comment</span>}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <form action={setReviewHidden}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="hidden" value={(!r.hidden).toString()} />
                    <button className="flex items-center gap-1 text-xs font-semibold border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                      {r.hidden ? <><Eye className="w-3.5 h-3.5" /> Show</> : <><EyeOff className="w-3.5 h-3.5" /> Hide</>}
                    </button>
                  </form>
                  <form action={deleteReview}>
                    <input type="hidden" name="id" value={r.id} />
                    <ConfirmSubmit message="Delete this review permanently?" className="flex items-center gap-1 text-xs font-semibold border border-rose-200 text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-slate-400 text-sm">No reviews yet.</p>}
        </div>
      </section>

      {/* Requirements */}
      <section>
        <h2 className="font-bold text-slate-900 mb-3">Requirements ({requirements.length})</h2>
        <div className="space-y-3">
          {requirements.map((req) => (
            <div key={req.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{req.subject}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${req.status === "open" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                      {req.status}
                    </span>
                    <span className="text-xs text-slate-400">by {req.student.name}</span>
                  </div>
                  <p className="text-slate-600 text-sm mt-1 line-clamp-2">{req.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <form action={moderateRequirement}>
                    <input type="hidden" name="id" value={req.id} />
                    <input type="hidden" name="op" value={req.status === "open" ? "close" : "open"} />
                    <button className="flex items-center gap-1 text-xs font-semibold border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                      {req.status === "open" ? <><Lock className="w-3.5 h-3.5" /> Close</> : <><RotateCcw className="w-3.5 h-3.5" /> Reopen</>}
                    </button>
                  </form>
                  <form action={moderateRequirement}>
                    <input type="hidden" name="id" value={req.id} />
                    <input type="hidden" name="op" value="delete" />
                    <ConfirmSubmit message="Delete this requirement permanently?" className="flex items-center gap-1 text-xs font-semibold border border-rose-200 text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>
            </div>
          ))}
          {requirements.length === 0 && <p className="text-slate-400 text-sm">No requirements yet.</p>}
        </div>
      </section>
    </div>
  );
}
