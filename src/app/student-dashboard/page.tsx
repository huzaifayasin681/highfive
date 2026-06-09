"use client";

import { useGlobal } from '@/context/GlobalContext';
import { BookOpen, Calendar, Clock, CreditCard, Play, Video } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const { state } = useGlobal();
  const { currentUser, lessons, tutors } = state;

  if (!currentUser || currentUser.role !== 'student') {
    return <div className="p-20 text-center text-xl font-bold">Please log in as a student to view this page.</div>;
  }

  const studentLessons = lessons.filter(l => l.studentId === currentUser.id);
  const upcomingLessons = studentLessons.filter(l => l.status === 'confirmed' || l.status === 'pending');
  const pastLessons = studentLessons.filter(l => l.status === 'completed');

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Next Lesson Card */}
            {upcomingLessons.length > 0 ? (
              <div className="bg-gradient-to-r from-highfive-blue to-blue-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Video className="w-48 h-48" />
                </div>
                <h2 className="text-xl font-bold mb-4 relative z-10">Your Next Lesson</h2>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 relative z-10 flex flex-col sm:flex-row justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold mb-1">{upcomingLessons[0].date} at {upcomingLessons[0].time}</div>
                    <div className="text-blue-100 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      with {tutors.find(t => t.id === upcomingLessons[0].tutorId)?.name}
                    </div>
                  </div>
                  <Link href={`/classroom/${upcomingLessons[0].id}`} className="mt-4 sm:mt-0 bg-success-green hover:bg-emerald-600 px-6 py-3 rounded-lg font-bold flex items-center transition-colors">
                    <Play className="w-5 h-5 mr-2" />
                    Join Classroom
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
                <h2 className="text-xl font-bold text-slate-900 mb-4">No upcoming lessons</h2>
                <Link href="/search" className="text-highfive-blue font-semibold hover:underline">Find a tutor and book a lesson</Link>
              </div>
            )}

            {/* Learning Progress (Mock Chart) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Learning Progress</h2>
              <div className="h-64 flex items-end justify-between space-x-2 pb-4">
                {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
                  <div key={i} className="w-full bg-blue-50 rounded-t-lg relative group">
                    <div 
                      className="absolute bottom-0 w-full bg-highfive-blue rounded-t-lg transition-all group-hover:bg-blue-600"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="absolute -bottom-6 w-full text-center text-xs text-slate-500 font-medium">
                      W{i+1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Lessons / Notes */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Notes & Homework</h2>
              <div className="space-y-4">
                {pastLessons.map(lesson => (
                  <div key={lesson.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-slate-900">
                        Lesson with {tutors.find(t => t.id === lesson.tutorId)?.name}
                      </div>
                      <div className="text-sm text-slate-500">{lesson.date}</div>
                    </div>
                    <p className="text-slate-600 text-sm">{lesson.notes || 'No notes for this lesson.'}</p>
                  </div>
                ))}
                {pastLessons.length === 0 && (
                  <p className="text-slate-500 text-sm">No completed lessons yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            
            {/* Upcoming Schedule */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-highfive-blue" />
                Upcoming Schedule
              </h2>
              <div className="space-y-4">
                {upcomingLessons.map(lesson => {
                  const tutor = tutors.find(t => t.id === lesson.tutorId);
                  return (
                    <div key={lesson.id} className="flex items-center space-x-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <div className="bg-blue-50 text-highfive-blue p-3 rounded-lg text-center min-w-[4rem]">
                        <div className="text-xs font-bold uppercase">{new Date(lesson.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                        <div className="text-xl font-bold">{new Date(lesson.date).getDate()}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{tutor?.name}</div>
                        <div className="text-sm text-slate-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> {lesson.time} ({lesson.status})
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Saved Tutors */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Saved Tutors</h2>
              <div className="space-y-4">
                {state.students.find(s => s.id === currentUser.id)?.savedTutors.map(tutorId => {
                  const tutor = tutors.find(t => t.id === tutorId);
                  if (!tutor) return null;
                  return (
                    <Link href={`/tutors/${tutor.id}`} key={tutor.id} className="flex items-center space-x-3 group">
                      <img src={tutor.avatar} alt={tutor.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-highfive-blue transition-colors">{tutor.name}</div>
                        <div className="text-xs text-slate-500">{tutor.subjects[0]}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
