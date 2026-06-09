"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { GlobalState, Tutor, Student, Lesson, Payment, Message, CurrentUser } from '@/types';
import { initialMockData } from '@/lib/mockData';

interface GlobalContextProps {
  state: GlobalState;
  isAuthModalOpen: boolean;
  authModalDefaultRole: 'student' | 'tutor' | null;
  openAuthModal: (role?: 'student' | 'tutor') => void;
  closeAuthModal: () => void;
  login: (user: CurrentUser) => void;
  logout: () => void;
  bookLesson: (lesson: Omit<Lesson, 'id' | 'status' | 'notes'>) => void;
  updateLessonStatus: (id: string, status: Lesson['status']) => void;
  sendMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void;
  saveTutor: (studentId: string, tutorId: string) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'date'>) => void;
  verifyTutor: (tutorId: string, approved: boolean) => void;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<GlobalState>(initialMockData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalDefaultRole, setAuthModalDefaultRole] = useState<'student' | 'tutor' | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('highfive_tutors_state');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('highfive_tutors_state', JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const openAuthModal = (role?: 'student' | 'tutor') => {
    setAuthModalDefaultRole(role || null);
    setIsAuthModalOpen(true);
  };
  
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = (user: CurrentUser) => setState(s => ({ ...s, currentUser: user }));
  
  const logout = () => setState(s => ({ ...s, currentUser: null }));

  const bookLesson = (lessonParams: Omit<Lesson, 'id' | 'status' | 'notes'>) => {
    const newLesson: Lesson = {
      ...lessonParams,
      id: `lesson_${Date.now()}`,
      status: 'pending',
      notes: '',
    };
    setState(s => ({ ...s, lessons: [...s.lessons, newLesson] }));
  };

  const updateLessonStatus = (id: string, status: Lesson['status']) => {
    setState(s => ({
      ...s,
      lessons: s.lessons.map(l => l.id === id ? { ...l, status } : l)
    }));
  };

  const sendMessage = (msgParams: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...msgParams,
      id: `msg_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setState(s => ({ ...s, messages: [...s.messages, newMessage] }));
  };

  const saveTutor = (studentId: string, tutorId: string) => {
    setState(s => ({
      ...s,
      students: s.students.map(st => {
        if (st.id === studentId) {
          const savedTutors = st.savedTutors.includes(tutorId)
            ? st.savedTutors.filter(id => id !== tutorId)
            : [...st.savedTutors, tutorId];
          return { ...st, savedTutors };
        }
        return st;
      })
    }));
  };

  const addPayment = (paymentParams: Omit<Payment, 'id' | 'date'>) => {
    const newPayment: Payment = {
      ...paymentParams,
      id: `pay_${Date.now()}`,
      date: new Date().toISOString(),
    };
    setState(s => ({ ...s, payments: [...s.payments, newPayment] }));
  };

  const verifyTutor = (tutorId: string, approved: boolean) => {
    setState(s => ({
      ...s,
      tutors: s.tutors
        .filter(t => t.id !== tutorId || approved)
        .map(t => t.id === tutorId ? { ...t, status: 'approved' as const } : t)
    }));
  };

  // Prevent hydration mismatch by not rendering until loaded
  if (!isLoaded) return null;

  return (
    <GlobalContext.Provider value={{ 
      state, isAuthModalOpen, authModalDefaultRole, openAuthModal, closeAuthModal, 
      login, logout, bookLesson, updateLessonStatus, sendMessage, saveTutor, addPayment, verifyTutor 
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobal must be used within a GlobalProvider");
  return context;
};
