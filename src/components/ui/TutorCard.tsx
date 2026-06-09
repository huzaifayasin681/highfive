import Link from 'next/link';
import { Star, BookOpen, Video, BadgeCheck } from 'lucide-react';
import { Tutor } from '@/types';

export default function TutorCard({ tutor }: { tutor: Tutor }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 card-hover overflow-hidden flex flex-col h-full group">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

      <div className="p-6 flex-grow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={tutor.avatar}
                alt={tutor.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
              />
              {tutor.status === 'approved' && (
                <div className="absolute -bottom-1 -right-1 bg-success-green rounded-full p-0.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{tutor.name}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                <span className="text-sm font-bold text-slate-700">{tutor.rating}</span>
                <span className="text-xs text-slate-400">({tutor.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>
          <div className="text-right bg-green-50 rounded-xl px-3 py-2 border border-green-100">
            <div className="text-lg font-extrabold text-success-green">Rs {tutor.rate.toLocaleString()}</div>
            <div className="text-xs text-slate-400 font-medium">/ hour</div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">{tutor.bio}</p>

        {/* Subject Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tutor.subjects.slice(0, 3).map((sub, i) => (
            <span key={i} className="bg-blue-50 text-highfive-blue text-xs font-semibold px-2.5 py-1 rounded-lg border border-blue-100">
              {sub}
            </span>
          ))}
        </div>

        {/* Qualifications */}
        <div className="space-y-1.5">
          <div className="flex items-center text-xs text-slate-500">
            <BookOpen className="w-3.5 h-3.5 mr-2 text-highfive-blue flex-shrink-0" />
            <span className="truncate">{tutor.qualifications[0]}</span>
          </div>
          <div className="flex items-center text-xs text-slate-500">
            <Video className="w-3.5 h-3.5 mr-2 text-highfive-blue flex-shrink-0" />
            <span>Live online lessons</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex gap-3">
        <Link
          href={`/tutors/${tutor.id}`}
          className="flex-1 bg-white border border-slate-200 text-slate-700 text-center py-2.5 rounded-xl font-semibold text-sm hover:border-highfive-blue hover:text-highfive-blue transition-colors"
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
