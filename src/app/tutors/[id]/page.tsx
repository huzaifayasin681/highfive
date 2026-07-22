import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  Award,
  Play,
  BadgeCheck,
} from "lucide-react";
import { getTeacherProfile } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { hasUnlockedTutor, PRICES } from "@/lib/payments";
import ContactWidget from "@/components/tutor/ContactWidget";
import ReviewSection from "@/components/tutor/ReviewSection";

export const dynamic = "force-dynamic";

function getYoutubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match ? match[1] : null;
}

function stars(n: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${i < n ? "text-yellow-400 fill-current" : "text-slate-200"}`}
    />
  ));
}

export default async function TutorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getTeacherProfile(id);
  if (!data) notFound();

  const { tutor, reviews } = data;
  const viewer = await getCurrentUser();
  const canReview =
    !!viewer && viewer.id !== tutor.id && ["STUDENT", "ADMIN"].includes(viewer.role);

  const existing =
    viewer && canReview
      ? await prisma.review.findUnique({
          where: { authorId_targetId: { authorId: viewer.id, targetId: tutor.id } },
        })
      : null;

  // Students must pay a one-time fee to unlock a tutor's contact. Non-students
  // (admins/teachers) and the tutor themselves are always "unlocked".
  const unlocked =
    !!viewer &&
    (viewer.role !== "STUDENT" || (await hasUnlockedTutor(viewer.id, tutor.id)));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 h-52 w-full relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-40" />
        <div className="absolute top-6 right-8 opacity-10">
          <Award className="w-40 h-40 text-white" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 -mt-20 relative z-10">
          {/* LEFT */}
          <div className="flex-grow space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
                <div className="relative flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tutor.avatar}
                    alt={tutor.name}
                    className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg object-cover"
                  />
                  {tutor.status === "approved" && (
                    <div className="absolute -bottom-2 -right-2 bg-success-green rounded-full p-1 shadow">
                      <BadgeCheck className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                        {tutor.name}
                      </h1>
                      <div className="flex items-center gap-3 mt-1 text-slate-500 text-sm flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-highfive-blue" />{" "}
                          {tutor.city ? `${tutor.city}, Pakistan` : "Pakistan"}
                        </span>
                        {tutor.responseTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-highfive-blue" /> Responds{" "}
                            {tutor.responseTime}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-2 text-center">
                      <div className="text-2xl font-extrabold text-success-green">
                        Rs {tutor.rate.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">per hour</div>
                    </div>
                  </div>
                  {tutor.rating > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-0.5">{stars(Math.round(tutor.rating))}</div>
                      <span className="font-bold text-slate-800">{tutor.rating}</span>
                      <span className="text-slate-500 text-sm">({tutor.reviewsCount} reviews)</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((s, i) => (
                      <span
                        key={i}
                        className="bg-emerald-50 text-highfive-blue text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-100"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-6">
                <h2 className="text-lg font-bold text-slate-900 mb-3">About</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{tutor.bio}</p>
              </div>
            </div>

            {/* Qualifications */}
            {tutor.qualifications.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-highfive-blue" /> Qualifications &amp; Background
                </h2>
                <div className="space-y-3">
                  {tutor.qualifications.map((q, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <CheckCircle2 className="w-5 h-5 text-success-green flex-shrink-0" />
                      <span className="text-slate-700 font-medium">{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Intro video placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Play className="w-5 h-5 text-highfive-blue" /> Introduction Video
              </h2>
              <div className="aspect-video bg-gradient-to-br from-slate-800 to-emerald-950 rounded-xl overflow-hidden relative group">
                {tutor.videoUrl ? (
                  getYoutubeId(tutor.videoUrl) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeId(tutor.videoUrl)}`}
                      className="w-full h-full border-0 absolute inset-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={tutor.videoUrl}
                      controls
                      className="w-full h-full object-cover absolute inset-0"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-200">
                        <Play className="w-7 h-7 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white text-sm font-medium opacity-70">
                      Introduction by {tutor.name.split(" ")[0]}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Reviews */}
            <ReviewSection
              targetId={tutor.id}
              rating={tutor.rating}
              reviewsCount={tutor.reviewsCount}
              reviews={reviews}
              canReview={canReview}
              existingRating={existing?.rating}
              existingComment={existing?.comment}
            />
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-[360px] flex-shrink-0">
            <ContactWidget
              targetId={tutor.id}
              targetName={tutor.name}
              rate={tutor.rate}
              rating={tutor.rating}
              isLoggedIn={!!viewer}
              unlocked={unlocked}
              unlockPrice={PRICES.UNLOCK_TUTOR}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
