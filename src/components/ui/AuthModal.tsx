"use client";

import { useGlobal } from '@/context/GlobalContext';
import { X, GraduationCap, Send, Phone } from 'lucide-react';
import { useState } from 'react';
import { submitContact } from '@/app/contact/actions';

export default function ContactModal() {
  const { isContactModalOpen, closeContactModal } = useGlobal();
  const [role, setRole] = useState<'student' | 'tutor'>('student');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isContactModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const subjectInterest = formData.get('subjectInterest') as string;

    const data = new FormData();
    data.set('name', `${firstName} ${lastName}`.trim());
    data.set('email', email);
    data.set('subject', `Enquiry (${role}): ${subjectInterest || 'General'}`);
    data.set('message', `Role: ${role}\nPhone: ${phone}\nInterested Subjects: ${subjectInterest}`);

    const res = await submitContact({}, data);
    setLoading(false);
    if (res.ok) {
      setSubmitted(true);
    } else {
      setError(res.error || 'Failed to submit enquiry. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        <button onClick={() => { closeContactModal(); setSubmitted(false); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-highfive-blue to-teal-700 px-8 pt-8 pb-6 text-white">
          <div className="flex items-center gap-2.5 mb-3">
            <GraduationCap className="w-6 h-6" />
            <span className="font-extrabold text-lg">HighFive Tutors</span>
          </div>
          <h2 className="text-2xl font-extrabold mb-1">{role === 'student' ? 'Start Learning Today' : 'Start Teaching Today'}</h2>
          <p className="text-emerald-200 text-sm">Fill in your details and we&apos;ll get back to you within 24 hours.</p>
        </div>

        <div className="p-8">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-7 h-7 text-success-green" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Enquiry Sent!</h3>
              <p className="text-slate-500 mb-6">Thank you! Our team will contact you within 24 hours.</p>
              <button onClick={() => { closeContactModal(); setSubmitted(false); }} className="bg-highfive-blue text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-800 transition-colors">
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Role toggle */}
              <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${role === 'student' ? 'bg-white text-highfive-blue shadow-sm' : 'text-slate-500'}`}
                  onClick={() => setRole('student')}
                >
                  I&apos;m a Student
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${role === 'tutor' ? 'bg-white text-highfive-blue shadow-sm' : 'text-slate-500'}`}
                  onClick={() => setRole('tutor')}
                >
                  I&apos;m a Tutor
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-600 text-xs">{error}</p>}
                <div className="grid grid-cols-2 gap-3">
                  <input required name="firstName" type="text" placeholder="First name" className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm" />
                  <input required name="lastName" type="text" placeholder="Last name" className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm" />
                </div>
                <input required name="email" type="email" placeholder="Email address" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm" />
                <input required name="phone" type="tel" placeholder="Phone / WhatsApp number" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm" />
                {role === 'student' ? (
                  <input name="subjectInterest" type="text" placeholder="Subject you need help with (e.g. IELTS, MDCAT)" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm" />
                ) : (
                  <input name="subjectInterest" type="text" placeholder="Subjects you can teach" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm" />
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-highfive-blue text-white font-bold py-3.5 rounded-xl hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Send className="w-4 h-4" /> {loading ? "Sending..." : "Submit Enquiry"}
                </button>
                <div className="text-center pt-1">
                  <a href="tel:0300-7511624" className="text-xs text-slate-500 hover:text-highfive-blue inline-flex items-center gap-1 font-medium">
                    <Phone className="w-3.5 h-3.5" /> Or call us directly: 0300-7511624
                  </a>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
