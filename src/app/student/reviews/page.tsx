import Link from "next/link";
import { Star, Search } from "lucide-react";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < n ? "text-yellow-400 fill-current" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

export default async function StudentReviewsPage() {
  const user = await requireRole(["STUDENT", "ADMIN"]);
  const reviews = await prisma.review.findMany({
    where: { authorId: user.id },
    include: { target: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">My Reviews</h1>
        <p className="text-slate-500 mt-1">Feedback you&apos;ve shared about your tutors.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500 mb-5">You haven&apos;t reviewed any tutors yet.</p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-highfive-blue text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-800 transition-colors"
          >
            <Search className="w-4 h-4" /> Browse tutors
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between gap-3 mb-2">
                <Link
                  href={`/tutors/${r.target.id}`}
                  className="font-bold text-slate-900 hover:text-highfive-blue transition-colors"
                >
                  {r.target.name}
                </Link>
                <span className="text-xs text-slate-400">
                  {r.createdAt.toLocaleDateString()}
                </span>
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
