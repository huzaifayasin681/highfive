"use client";

import { useGlobal } from '@/context/GlobalContext';
import { useParams } from 'next/navigation';
import { Star, BookOpen, ShieldCheck, CheckCircle2, MapPin, Clock, Award, MessageCircle, Play, BadgeCheck, Send } from 'lucide-react';
import Link from 'next/link';

export default function TutorProfilePage() {
  const { state, openContactModal } = useGlobal();
  const params = useParams();
  const tutor = state.tutors.find(t => t.id === (params?.id as string));

  if (!tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Tutor not found</h2>
          <Link href="/search" className="text-highfive-blue font-semibold hover:underline">Browse all tutors →</Link>
        </div>
      </div>
    );
  }

  const stars = (n: number) => Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`w-4 h-4 ${i < n ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} />
  ));

  const mockReviews = [
    { name: 'Zara K.', rating: 5, text: 'Absolutely brilliant! My grades improved significantly after just 3 sessions.', date: '2 weeks ago' },
    { name: 'Ali H.', rating: 5, text: 'Very patient, explains concepts clearly. Highly recommend to anyone struggling.', date: '1 month ago' },
    { name: 'Sana M.', rating: 5, text: 'Professional, punctual and extremely knowledgeable. Best tutor on this platform!', date: '1 month ago' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 h-52 w-full relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-40" />
        <div className="absolute top-6 right-8 opacity-10">
          <Award className="w-40 h-40 text-white" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 -mt-20 relative z-10">

          {/* ── LEFT ── */}
          <div className="flex-grow space-y-6">

            {/* Profile card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
                <div className="relative flex-shrink-0">
                  <img src={tutor.avatar} alt={tutor.name} className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg object-cover" />
                  {tutor.status === 'approved' && (
                    <div className="absolute -bottom-2 -right-2 bg-success-green rounded-full p-1 shadow">
                      <BadgeCheck className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{tutor.name}</h1>
                      <div className="flex items-center gap-3 mt-1 text-slate-500 text-sm flex-wrap">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-highfive-blue" /> Pakistan</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-highfive-blue" /> Responds within 1 hour</span>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-2 text-center">
                      <div className="text-2xl font-extrabold text-success-green">Rs {tutor.rate.toLocaleString()}</div>
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
                      <span key={i} className="bg-blue-50 text-highfive-blue text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-100">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-6">
                <h2 className="text-lg font-bold text-slate-900 mb-3">About</h2>
                <p className="text-slate-600 leading-relaxed">{tutor.bio}</p>
              </div>
            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-highfive-blue" /> Qualifications & Background
              </h2>
              <div className="space-y-3">
                {tutor.qualifications.map((q, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-success-green flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Intro video placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Play className="w-5 h-5 text-highfive-blue" /> Introduction Video
              </h2>
              <div className="aspect-video bg-gradient-to-br from-slate-800 to-blue-950 rounded-xl overflow-hidden relative cursor-pointer group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-200">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 text-white text-sm font-medium opacity-70">Introduction by {tutor.name.split(' ')[0]}</div>
              </div>
            </div>

            {/* Reviews */}
            {tutor.rating > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-highfive-blue" /> Student Reviews
                </h2>
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                  <div className="text-5xl font-extrabold text-slate-900">{tutor.rating}</div>
                  <div>
                    <div className="flex gap-1 mb-1">{stars(Math.round(tutor.rating))}</div>
                    <div className="text-sm text-slate-500">{tutor.reviewsCount} reviews</div>
                  </div>
                </div>
                <div className="space-y-5">
                  {mockReviews.map((r, i) => (
                    <div key={i} className="pb-5 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-highfive-blue font-bold text-sm">{r.name.charAt(0)}</div>
                          <span className="font-semibold text-slate-900 text-sm">{r.name}</span>
                        </div>
                        <span className="text-xs text-slate-400">{r.date}</span>
                      </div>
                      <div className="flex gap-0.5 mb-2">{stars(r.rating)}</div>
                      <p className="text-slate-600 text-sm leading-relaxed">"{r.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT — Enquiry Widget ── */}
          <div className="w-full lg:w-[360px] flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-highfive-blue to-indigo-700 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-3xl font-extrabold">Rs {tutor.rate.toLocaleString()}</div>
                    <div className="text-blue-200 text-sm mt-0.5">per 60-minute session</div>
                  </div>
                  {tutor.rating > 0 && (
                    <div className="bg-white/20 rounded-xl px-3 py-2 text-center">
                      <div className="font-bold text-lg leading-none">{tutor.rating}</div>
                      <Star className="w-3.5 h-3.5 mx-auto mt-0.5 fill-current text-yellow-300" />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <button
                  onClick={openContactModal}
                  className="w-full bg-success-green hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Book a Trial Lesson
                </button>
                <button
                  onClick={openContactModal}
                  className="w-full border border-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl hover:border-highfive-blue hover:text-highfive-blue transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Send a Message
                </button>

                {/* Trust badges */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  {['Free cancellation 24h before session', '100% satisfaction guarantee', 'Secure payment via JazzCash / EasyPaisa'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success-green flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
