"use client";

import { useState } from 'react';
import { useGlobal } from '@/context/GlobalContext';
import { useParams, useRouter } from 'next/navigation';
import { Star, Video, BookOpen, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function TutorProfilePage() {
  const { state, bookLesson } = useGlobal();
  const params = useParams();
  const router = useRouter();
  const tutorId = params?.id as string;

  const tutor = state.tutors.find(t => t.id === tutorId);
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  if (!tutor) {
    return <div className="text-center py-20 text-2xl font-bold">Tutor not found</div>;
  }

  const availableDates = Object.keys(tutor.schedule);

  const handleBook = () => {
    if (!state.currentUser) {
      alert("Please log in to book a lesson.");
      return;
    }
    if (selectedDate && selectedTime) {
      bookLesson({
        tutorId: tutor.id,
        studentId: state.currentUser.id,
        date: selectedDate,
        time: selectedTime,
      });
      alert(`Lesson booked successfully for ${selectedDate} at ${selectedTime}!`);
      router.push('/student-dashboard');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Profile Header (Banner) */}
      <div className="bg-highfive-blue h-48 w-full relative"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column (Main Info) */}
          <div className="flex-grow">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 sm:-mt-20 mb-6">
                <img src={tutor.avatar} alt={tutor.name} className="w-32 h-32 rounded-2xl border-4 border-white shadow-md object-cover bg-white" />
                <div className="flex-grow">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{tutor.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center text-yellow-500 font-semibold">
                      <Star className="w-5 h-5 fill-current mr-1" />
                      {tutor.rating} ({tutor.reviewsCount} reviews)
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1 text-highfive-blue" />
                      {tutor.subjects.join(', ')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none text-slate-700">
                <h2 className="text-xl font-bold text-slate-900 mb-4">About Me</h2>
                <p>{tutor.bio}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <Video className="w-5 h-5 mr-2 text-highfive-blue" />
                Introduction Video
              </h2>
              <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative group cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                  </div>
                </div>
                {/* Simulated video poster */}
                <div className="w-full h-full bg-gradient-to-tr from-slate-800 to-slate-700 opacity-80 mix-blend-overlay"></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-highfive-blue" />
                Qualifications & Background
              </h2>
              <ul className="space-y-3">
                {tutor.qualifications.map((qual, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-success-green mr-3 flex-shrink-0" />
                    <span className="text-slate-700">{qual}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column (Sticky Booking Widget) */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                <div className="text-3xl font-bold text-slate-900">${tutor.rate}</div>
                <div className="text-slate-500 font-medium">per hour</div>
              </div>

              <h3 className="font-bold text-slate-900 mb-4">1. Select Date</h3>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {availableDates.map(date => (
                  <button
                    key={date}
                    onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                    className={`py-2 rounded-lg font-medium text-sm border transition-colors ${
                      selectedDate === date 
                        ? 'border-highfive-blue bg-blue-50 text-highfive-blue' 
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </button>
                ))}
              </div>

              {selectedDate && (
                <>
                  <h3 className="font-bold text-slate-900 mb-4">2. Select Time</h3>
                  <div className="grid grid-cols-3 gap-2 mb-8">
                    {tutor.schedule[selectedDate].map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 rounded-lg font-medium text-sm border transition-colors ${
                          selectedTime === time 
                            ? 'border-highfive-blue bg-blue-50 text-highfive-blue' 
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button
                disabled={!selectedDate || !selectedTime}
                onClick={handleBook}
                className="w-full bg-success-green hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-emerald-200 disabled:shadow-none"
              >
                Book Lesson
              </button>
              
              <div className="mt-4 text-center">
                <Link href="/messages" className="text-highfive-blue font-semibold hover:underline text-sm">
                  Send a message first
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
