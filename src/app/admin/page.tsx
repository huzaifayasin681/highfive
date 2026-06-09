"use client";

import { useGlobal } from '@/context/GlobalContext';
import { Users, DollarSign, ShieldAlert, LayoutDashboard, Ticket, Trash2 } from 'lucide-react';

export default function AdminPanel() {
  const { state, verifyTutor } = useGlobal();
  const { students, tutors, payments } = state;
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
          <ShieldAlert className="w-8 h-8 mr-3 text-highfive-blue" />
          Admin Control Panel
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 text-highfive-blue rounded-full flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{students.length + tutors.length}</div>
              <div className="text-sm text-slate-500 font-medium">Total Active Users</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-50 text-success-green rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">${totalRevenue.toFixed(2)}</div>
              <div className="text-sm text-slate-500 font-medium">Total Platform Volume</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">4</div>
              <div className="text-sm text-slate-500 font-medium">Open Support Tickets</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-slate-900">Pending Tutor Verifications</h2>
          </div>
          <div className="p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Tutor Name</th>
                  <th className="pb-3 font-semibold">Subjects</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tutors.filter(t => t.status === 'pending').length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">No pending verifications.</td>
                  </tr>
                ) : (
                  tutors.filter(t => t.status === 'pending').map(tutor => (
                    <tr key={tutor.id} className="border-b border-slate-50">
                      <td className="py-4 font-medium text-slate-900">{tutor.name}</td>
                      <td className="py-4 text-slate-600">{tutor.subjects.join(', ')}</td>
                      <td className="py-4"><span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">Awaiting Review</span></td>
                      <td className="py-4 text-right">
                        <button onClick={() => state.currentUser?.role === 'admin' ? verifyTutor(tutor.id, true) : alert('Must be admin')} className="text-highfive-blue font-semibold hover:underline mr-4">Approve</button>
                        <button onClick={() => state.currentUser?.role === 'admin' ? verifyTutor(tutor.id, false) : alert('Must be admin')} className="text-red-500 font-semibold hover:underline">Reject</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
