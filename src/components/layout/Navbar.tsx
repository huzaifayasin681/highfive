"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, MessageSquare, LayoutDashboard, LogOut, GraduationCap } from 'lucide-react';
import { useGlobal } from '@/context/GlobalContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { state, logout, openAuthModal } = useGlobal();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { currentUser } = state;

  const closeMenu = () => setIsOpen(false);

  const NavLinks = () => (
    <>
      <Link
        href="/search"
        onClick={closeMenu}
        className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-highfive-blue ${pathname === '/search' ? 'text-highfive-blue' : 'text-slate-600'}`}
      >
        <Search className="w-4 h-4" />
        Find Tutors
      </Link>
      {currentUser && (
        <>
          <Link
            href={currentUser.role === 'tutor' ? '/tutor-dashboard' : currentUser.role === 'admin' ? '/admin' : '/student-dashboard'}
            onClick={closeMenu}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-highfive-blue ${pathname.includes('dashboard') || pathname === '/admin' ? 'text-highfive-blue' : 'text-slate-600'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/messages"
            onClick={closeMenu}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-highfive-blue ${pathname === '/messages' ? 'text-highfive-blue' : 'text-slate-600'}`}
          >
            <MessageSquare className="w-4 h-4" />
            Messages
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl flex items-center justify-center shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">HighFive</span>
                <span className="text-highfive-blue font-extrabold text-lg"> Tutors</span>
              </div>
            </Link>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <NavLinks />
            {!currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openAuthModal('student')}
                  className="text-slate-600 hover:text-highfive-blue font-medium text-sm transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal('student')}
                  className="bg-highfive-blue text-white px-5 py-2 rounded-xl hover:bg-blue-800 transition-colors font-semibold text-sm shadow-sm"
                >
                  Sign Up Free
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-highfive-blue font-bold text-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-slate-700">{currentUser.name}</span>
                <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-4 space-y-3">
          <NavLinks />
          <div className="pt-3 border-t border-slate-100">
            {!currentUser ? (
              <div className="flex flex-col gap-2">
                <button onClick={() => { closeMenu(); openAuthModal('student'); }} className="text-left text-slate-600 font-medium py-2 text-sm">Log In</button>
                <button onClick={() => { closeMenu(); openAuthModal('student'); }} className="w-full bg-highfive-blue text-white px-4 py-2 rounded-xl font-semibold text-sm">Sign Up Free</button>
              </div>
            ) : (
              <div className="flex items-center justify-between py-2">
                <span className="font-medium text-slate-700 text-sm">{currentUser.name}</span>
                <button onClick={logout} className="text-red-500 flex items-center gap-1 text-sm">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
