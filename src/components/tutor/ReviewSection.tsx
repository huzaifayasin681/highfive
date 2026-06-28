"use client";

import { useActionState, useState } from "react";
import { MessageCircle, Star } from "lucide-react";
import { submitReview, type ActionState } from "@/app/student/actions";

type Review = {
  id: string;
  authorName: string;
  rating: number;
  comment: string | null;
  createdAt: Date | string;
};

function Stars({ n, className = "" }: { n: number; className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < n ? "text-yellow-400 fill-current" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

function timeAgo(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export default function ReviewSection({
  targetId,
  rating,
  reviewsCount,
  reviews,
  canReview,
  existingRating,
  existingComment,
}: {
  targetId: string;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  canReview: boolean;
  existingRating?: number;
  existingComment?: string | null;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    submitReview,
    {}
  );
  const [picked, setPicked] = useState(existingRating ?? 0);
  const [hover, setHover] = useState(0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-highfive-blue" /> Student Reviews
      </h2>

      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
        <div className="text-5xl font-extrabold text-slate-900">
          {rating > 0 ? rating.toFixed(1) : "—"}
        </div>
        <div>
          <Stars n={Math.round(rating)} className="mb-1" />
          <div className="text-sm text-slate-500">{reviewsCount} reviews</div>
        </div>
      </div>

      {/* Write a review */}
      {canReview && (
        <form action={formAction} className="mb-8 bg-slate-50 border border-slate-100 rounded-2xl p-5">
          <input type="hidden" name="targetId" value={targetId} />
          <input type="hidden" name="rating" value={picked} />
          <p className="font-bold text-slate-900 mb-3 text-sm">
            {existingRating ? "Update your review" : "Leave a review"}
          </p>
          <div className="flex gap-1 mb-3">
            {Array.from({ length: 5 }, (_, i) => {
              const value = i + 1;
              const active = (hover || picked) >= value;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPicked(value)}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(0)}
                  aria-label={`${value} star${value > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      active ? "text-yellow-400 fill-current" : "text-slate-300"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <textarea
            name="comment"
            rows={3}
            defaultValue={existingComment ?? ""}
            placeholder="Share your experience with this tutor…"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm resize-none mb-3"
          />
          {state.error && <p className="text-red-600 text-xs mb-3">{state.error}</p>}
          {state.ok && <p className="text-emerald-600 text-xs mb-3">Thanks! Your review was saved.</p>}
          <button
            type="submit"
            disabled={pending || picked === 0}
            className="bg-highfive-blue text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-emerald-800 transition-colors disabled:opacity-50"
          >
            {pending ? "Saving…" : existingRating ? "Update review" : "Submit review"}
          </button>
        </form>
      )}

      {/* Existing reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-5">
          {reviews.map((r) => (
            <div key={r.id} className="pb-5 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-highfive-blue font-bold text-sm">
                    {r.authorName.charAt(0)}
                  </div>
                  <span className="font-semibold text-slate-900 text-sm">{r.authorName}</span>
                </div>
                <span className="text-xs text-slate-400">{timeAgo(r.createdAt)}</span>
              </div>
              <Stars n={r.rating} className="mb-2" />
              {r.comment && <p className="text-slate-600 text-sm leading-relaxed">{r.comment}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-sm">No reviews yet — be the first to leave one.</p>
      )}
    </div>
  );
}
