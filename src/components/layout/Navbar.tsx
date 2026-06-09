"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, GraduationCap } from 'lucide-react';
import { useGlobal } from '@/context/GlobalContext';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Find Tutors', href: '/search' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
];

export default function Navbar() {
  const { openContactModal } = useGlobal();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const close = () => setIsOpen(false);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" onClick={close}>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">
              High<span className="text-highfive-blue">Five</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} className={`text-sm font-medium transition-colors hover:text-highfive-blue ${pathname === l.href ? 'text-highfive-blue' : 'text-slate-600'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={openContactModal}
              className="text-sm font-semibold text-highfive-blue border border-highfive-blue px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Become a Tutor
            </button>
            <button
              onClick={openContactModal}
              className="bg-highfive-blue text-white px-5 py-2 rounded-xl hover:bg-blue-800 transition-colors font-semibold text-sm shadow-sm"
            >
              Get Started Free
            </button>
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
            <button onClick={() => { close(); openContactModal(); }} className="w-full bg-highfive-blue text-white py-3 rounded-xl font-bold">Get Started Free</button>
            <button onClick={() => { close(); openContactModal(); }} className="w-full border border-highfive-blue text-highfive-blue py-3 rounded-xl font-bold">Become a Tutor</button>
          </div>
        </div>
      )}
    </nav>
  );
}
