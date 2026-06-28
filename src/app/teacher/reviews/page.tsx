import { Star } from "lucide-react";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < n ? "text-yellow-400 fill-current" : "text-slate-200"}`} />
      ))}
    </div>
  );
}

export default async function TeacherReviewsPage() {
  const user = await requireRole(["TEACHER", "ADMIN"]);

  const [profile, reviews] = await Promise.all([
    prisma.teacherProfile.findUnique({ where: { userId: user.id }, select: { rating: true, reviewsCount: true } }),
    prisma.review.findMany({
      where: { targetId: user.id, hidden: false },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Reviews</h1>
        <p className="text-slate-500 mt-1">What students say about your teaching.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
        <div className="text-5xl font-extrabold text-slate-900">
          {profile?.rating ? profile.rating.toFixed(1) : "—"}
        </div>
        <div>
          <Stars n={Math.round(profile?.rating ?? 0)} />
          <div className="text-sm text-slate-500 mt-1">{profile?.reviewsCount ?? 0} reviews</div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500">No written reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-highfive-blue font-bold text-sm">
                    {r.author.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-slate-900 text-sm">{r.author.name}</span>
                </div>
                <span className="text-xs text-slate-400">{r.createdAt.toLocaleDateString()}</span>
              </div>
              <Stars n={r.rating} />
              {r.comment && <p className="text-slate-600 text-sm mt-2 leading-relaxed">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
