"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, GraduationCap } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import UserMenu from '@/components/layout/UserMenu';

const NAV_LINKS = [
  { label: 'Find Tutors', href: '/search' },
  { label: 'How It Works', href: '/how-it-works/students' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function dashboardPath(role?: string) {
  if (role === 'ADMIN') return '/admin';
  if (role === 'TEACHER') return '/teacher';
  if (role === 'STUDENT') return '/student';
  return '/';
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const close = () => setIsOpen(false);
  const isAuthed = status === 'authenticated';
  const dash = dashboardPath(session?.user?.role);

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/70 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" onClick={close}>
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(5,150,105,0.5)]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">
              High<span className="text-highfive-blue">Five</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-slate-50/80 border border-slate-200/60 rounded-full p-1">
            {NAV_LINKS.map(l => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-colors ${
                    active ? 'bg-white text-highfive-blue shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2.5">
            {isAuthed && session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost">Log in</Link>
                <Link href="/register" className="btn btn-primary">Get Started Free</Link>
              </>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-5 space-y-1">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={close} className="block py-2.5 text-slate-700 font-medium hover:text-highfive-blue transition-colors">
              {l.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 mt-2">
            {isAuthed ? (
              <>
                <Link href={dash} onClick={close} className="w-full text-center bg-highfive-blue text-white py-3 rounded-xl font-bold">Dashboard</Link>
                <button onClick={() => { close(); signOut({ callbackUrl: '/' }); }} className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-bold">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/register" onClick={close} className="w-full text-center bg-highfive-blue text-white py-3 rounded-xl font-bold">Get Started Free</Link>
                <Link href="/login" onClick={close} className="w-full text-center border border-highfive-blue text-highfive-blue py-3 rounded-xl font-bold">Log in</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
