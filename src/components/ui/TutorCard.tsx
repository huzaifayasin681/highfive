import Link from 'next/link';
import { Star, BookOpen, BadgeCheck, MapPin, Clock } from 'lucide-react';
import { Tutor } from '@/types';

export default function TutorCard({ tutor }: { tutor: Tutor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 card-hover overflow-hidden flex flex-col h-full group shadow-sm">
      {/* Color accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      <div className="p-6 flex-grow flex flex-col">
        {/* Header row */}
        <div className="flex gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <img
              src={tutor.avatar}
              alt={tutor.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
            />
            {tutor.status === 'approved' && (
              <div className="absolute -bottom-1 -right-1 bg-success-green rounded-full p-0.5 shadow">
                <BadgeCheck className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>

          <div className="flex-grow min-w-0">
            <h3 className="font-bold text-slate-900 text-base truncate">{tutor.name}</h3>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" /> Pakistan
            </div>
            {tutor.rating > 0 ? (
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                <span className="font-bold text-slate-800 text-sm">{tutor.rating}</span>
                <span className="text-xs text-slate-400">({tutor.reviewsCount})</span>
              </div>
            ) : (
              <span className="inline-block mt-1 text-xs bg-amber-50 text-amber-600 font-semibold px-2 py-0.5 rounded-full border border-amber-100">New Tutor</span>
            )}
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-lg font-extrabold text-success-green">Rs {tutor.rate.toLocaleString()}</div>
            <div className="text-xs text-slate-400">/ hour</div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">{tutor.bio}</p>

        {/* Subject tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tutor.subjects.slice(0, 3).map((s, i) => (
            <span key={i} className="bg-blue-50 text-highfive-blue text-xs font-semibold px-2.5 py-1 rounded-lg border border-blue-100">
              {s}
            </span>
          ))}
          {tutor.subjects.length > 3 && (
            <span className="bg-slate-50 text-slate-500 text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-200">
              +{tutor.subjects.length - 3} more
            </span>
          )}
        </div>

        {/* Qualification */}
        <div className="flex items-center text-xs text-slate-500 mt-auto pt-3 border-t border-slate-50">
          <BookOpen className="w-3.5 h-3.5 mr-1.5 text-highfive-blue flex-shrink-0" />
          <span className="truncate">{tutor.qualifications[0]}</span>
        </div>
      </div>

      {/* CTA footer */}
      <div className="px-6 pb-5 flex gap-3">
        <Link
          href={`/tutors/${tutor.id}`}
          className="flex-1 bg-white border border-slate-200 text-slate-700 text-center py-2.5 rounded-xl font-semibold text-sm hover:border-highfive-blue hover:text-highfive-blue transition-all"
        >
          View Profile
        </Link>
        <Link
          href={`/tutors/${tutor.id}?book=true`}
          className="flex-1 bg-highfive-blue text-white text-center py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors shadow-sm"
        >
          Book Trial
        </Link>
      </div>
    </div>
  );
}
