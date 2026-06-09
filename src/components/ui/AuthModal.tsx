"use client";

import { useGlobal } from '@/context/GlobalContext';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CurrentUser } from '@/types';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalDefaultRole, login, state } = useGlobal();
  const [role, setRole] = useState<'student' | 'tutor'>('student');

  useEffect(() => {
    if (authModalDefaultRole) {
      setRole(authModalDefaultRole);
    }
  }, [authModalDefaultRole]);

  if (!isAuthModalOpen) return null;

  const handleMockLogin = (selectedRole: 'student' | 'tutor' | 'admin') => {
    let mockUser: CurrentUser;
    
    if (selectedRole === 'student') {
      mockUser = { id: state.students[0]?.id || 's1', name: state.students[0]?.name || 'Student Name', role: 'student' };
    } else if (selectedRole === 'tutor') {
      mockUser = { id: state.tutors[0]?.id || 't1', name: state.tutors[0]?.name || 'Tutor Name', role: 'tutor' };
    } else {
      mockUser = { id: 'admin1', name: 'Admin User', role: 'admin' };
    }
    
    login(mockUser);
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        <button onClick={closeAuthModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Welcome to HighFive</h2>
          
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button 
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${role === 'student' ? 'bg-white text-highfive-blue shadow-sm' : 'text-slate-500'}`}
              onClick={() => setRole('student')}
            >
              I am a Student
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${role === 'tutor' ? 'bg-white text-highfive-blue shadow-sm' : 'text-slate-500'}`}
              onClick={() => setRole('tutor')}
            >
              I am a Tutor
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <input type="email" placeholder="Email address" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue" value="demo@example.com" readOnly />
            <input type="password" placeholder="Password" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-highfive-blue" value="password123" readOnly />
          </div>

          <button 
            onClick={() => handleMockLogin(role)}
            className="w-full bg-highfive-blue text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors mb-4"
          >
            Log In (Mock)
          </button>
          
          <div className="text-center">
            <button onClick={() => handleMockLogin('admin')} className="text-sm text-slate-400 hover:text-highfive-blue font-medium">
              Log in as Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
