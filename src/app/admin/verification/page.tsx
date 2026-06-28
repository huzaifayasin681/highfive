import Link from "next/link";
import { ShieldCheck, Check, X, MapPin, Wallet, BookOpen } from "lucide-react";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { setTeacherVerification } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function VerificationPage() {
  await requireRole("ADMIN");

  const pending = await prisma.teacherProfile.findMany({
    where: { verificationStatus: "pending" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      subjects: { select: { name: true } },
    },
    orderBy: { user: { createdAt: "asc" } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Teacher Verification</h1>
        <p className="text-slate-500 mt-1">Approve or reject teacher profiles before they go live.</p>
      </div>

      {pending.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">All caught up</h3>
          <p className="text-slate-500 text-sm">There are no teachers awaiting verification.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900">{p.user.name}</h3>
                  <p className="text-xs text-slate-400">{p.user.email}</p>
                  <p className="text-slate-600 text-sm mt-3 leading-relaxed line-clamp-3">
                    {p.bio || <span className="italic text-slate-400">No bio provided.</span>}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                    {p.hourlyRate != null && (
                      <span className="flex items-center gap-1">
                        <Wallet className="w-3.5 h-3.5" /> Rs {p.hourlyRate.toLocaleString()}/hr
                      </span>
                    )}
                    {p.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {p.location}
                      </span>
                    )}
                    {p.experienceYears != null && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> {p.experienceYears} yrs experience
                      </span>
                    )}
                  </div>
                  {p.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.subjects.map((s) => (
                        <span key={s.name} className="bg-emerald-50 text-highfive-blue text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-100">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link href={`/tutors/${p.user.id}`} className="inline-block text-sm font-semibold text-highfive-blue hover:underline mt-3">
                    Preview public profile →
                  </Link>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <form action={setTeacherVerification}>
                    <input type="hidden" name="userId" value={p.user.id} />
                    <input type="hidden" name="decision" value="approved" />
                    <button className="flex items-center gap-1.5 bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors">
                      <Check className="w-4 h-4" /> Approve
                    </button>
                  </form>
                  <form action={setTeacherVerification}>
                    <input type="hidden" name="userId" value={p.user.id} />
                    <input type="hidden" name="decision" value="rejected" />
                    <button className="flex items-center gap-1.5 border border-rose-200 text-rose-600 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-rose-50 transition-colors">
                      <X className="w-4 h-4" /> Reject
                    </button>
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
