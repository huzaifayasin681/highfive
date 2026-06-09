"use client";

import { useGlobal } from '@/context/GlobalContext';
import { Calendar, CheckCircle, XCircle, DollarSign, Upload, Users } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function TutorDashboard() {
  const { state, updateLessonStatus } = useGlobal();
  const { currentUser, lessons, students } = state;
  const [activeTab, setActiveTab] = useState('requests');

  // For prototype purposes, let's allow viewing this as 'tutor' or fallback to the first tutor if logged in as admin to see it
  const tutorId = currentUser?.role === 'tutor' ? currentUser.id : state.tutors[0]?.id;

  if (!currentUser || (currentUser.role !== 'tutor' && currentUser.role !== 'admin')) {
    return <div className="p-20 text-center text-xl font-bold">Please log in as a tutor to view this page.</div>;
  }

  const myLessons = lessons.filter(l => l.tutorId === tutorId);
  const pendingRequests = myLessons.filter(l => l.status === 'pending');
  const upcomingLessons = myLessons.filter(l => l.status === 'confirmed');

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Tutor Dashboard</h1>
        
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-50 text-highfive-blue rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{upcomingLessons.length}</div>
            <div className="text-sm text-slate-500 font-medium mt-1">Upcoming Lessons</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{pendingRequests.length}</div>
            <div className="text-sm text-slate-500 font-medium mt-1">Pending Requests</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-emerald-50 text-success-green rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">$1,240</div>
            <div className="text-sm text-slate-500 font-medium mt-1">Earnings This Month</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm bg-gradient-to-br from-highfive-blue to-blue-800 text-white border-none">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
            </div>
            <div className="text-xl font-bold mb-2">Upload Notes</div>
            <label className="text-sm bg-white text-highfive-blue px-4 py-2 rounded-lg font-bold w-full hover:bg-slate-100 transition-colors cursor-pointer text-center block">
              Select File
              <input type="file" className="hidden" onChange={(e) => {
                if(e.target.files && e.target.files.length > 0) {
                  alert(`File ${e.target.files[0].name} uploaded successfully!`);
                }
              }} />
            </label>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-4 font-semibold text-center transition-colors ${activeTab === 'requests' ? 'text-highfive-blue border-b-2 border-highfive-blue bg-slate-50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Booking Requests ({pendingRequests.length})
            </button>
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 py-4 font-semibold text-center transition-colors ${activeTab === 'schedule' ? 'text-highfive-blue border-b-2 border-highfive-blue bg-slate-50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Upcoming Schedule
            </button>
            <button 
              onClick={() => setActiveTab('earnings')}
              className={`flex-1 py-4 font-semibold text-center transition-colors hidden md:block ${activeTab === 'earnings' ? 'text-highfive-blue border-b-2 border-highfive-blue bg-slate-50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Earnings Analytics
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'requests' && (
              <div className="space-y-4">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">No pending booking requests.</div>
                ) : (
                  pendingRequests.map(req => {
                    const student = students.find(s => s.id === req.studentId);
                    return (
                      <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-xl">
                        <div className="mb-4 sm:mb-0">
                          <div className="font-bold text-slate-900 text-lg">{student?.name}</div>
                          <div className="text-slate-600">Requested: {req.date} at {req.time}</div>
                          <div className="text-sm text-slate-500 mt-1">{student?.grade}</div>
                        </div>
                        <div className="flex space-x-3">
                          <button onClick={() => updateLessonStatus(req.id, 'confirmed')} className="flex items-center px-4 py-2 bg-success-green text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                            <CheckCircle className="w-4 h-4 mr-2" /> Approve
                          </button>
                          <button onClick={() => updateLessonStatus(req.id, 'cancelled')} className="flex items-center px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors">
                            <XCircle className="w-4 h-4 mr-2" /> Deny
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-4">
                {upcomingLessons.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">No confirmed lessons upcoming.</div>
                ) : (
                  upcomingLessons.map(lesson => {
                    const student = students.find(s => s.id === lesson.studentId);
                    return (
                      <div key={lesson.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                        <div className="flex items-center space-x-4">
                          <div className="bg-highfive-blue text-white p-3 rounded-lg text-center min-w-[4rem]">
                            <div className="text-xs font-bold uppercase">{new Date(lesson.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                            <div className="text-xl font-bold">{new Date(lesson.date).getDate()}</div>
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{student?.name}</div>
                            <div className="text-slate-600">{lesson.time}</div>
                          </div>
                        </div>
                        <Link href={`/classroom/${lesson.id}`} className="bg-highfive-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors">
                          Enter Class
                        </Link>
                      </div>
                    )
                  })
                )}
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="py-8 text-center text-slate-500">
                <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                  [ Earnings Chart Visualization Placeholder ]
                </div>
                Detailed analytics will appear here once you have completed more lessons.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
