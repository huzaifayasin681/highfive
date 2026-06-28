"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, Star, BookOpen, Video, Target, TrendingUp, ShieldCheck, Users, Award, Zap, GraduationCap, MessageCircle, CheckCircle2, Calculator, Atom, FlaskConical, Dna, Code, Stethoscope, PenTool } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import TutorCard from '@/components/ui/TutorCard';
import TrustBar from '@/components/ui/TrustBar';
import { initialMockData } from '@/lib/mockData';
import { useGlobal } from '@/context/GlobalContext';

const TYPEWRITER_WORDS = ['Mathematics', 'Physics', 'IELTS', 'React', 'MDCAT', 'Chemistry', 'Coding'];

function TypewriterText() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = TYPEWRITER_WORDS[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 100);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 55);
    } else {
      setDeleting(false);
      setWordIndex(i => (i + 1) % TYPEWRITER_WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex]);

  return (
    <span>
      {displayed}
      <span className="inline-block w-1 h-9 md:h-12 bg-emerald-400 ml-1 rounded-full align-middle animate-pulse" />
    </span>
  );
}

const stats: { value: string; label: string; icon: LucideIcon }[] = [
  { value: '5,000+', label: 'Students', icon: Users },
  { value: '500+', label: 'Expert Tutors', icon: GraduationCap },
  { value: '50,000+', label: 'Online Lessons', icon: Video },
  { value: '4.9', label: 'Average Rating', icon: Star },
];

const subjects: { name: string; sub: string; icon: LucideIcon; color: string }[] = [
  { name: 'Mathematics', sub: 'Algebra, Calculus & more', icon: Calculator, color: 'from-emerald-500 to-emerald-700' },
  { name: 'Physics', sub: 'FSc & Entry Test Prep', icon: Atom, color: 'from-teal-500 to-teal-700' },
  { name: 'Chemistry', sub: 'MDCAT / FSc', icon: FlaskConical, color: 'from-cyan-500 to-cyan-700' },
  { name: 'Biology', sub: 'MDCAT / FSc', icon: Dna, color: 'from-green-500 to-green-700' },
  { name: 'Computer Science', sub: 'Coding & Web Dev', icon: Code, color: 'from-emerald-600 to-teal-700' },
  { name: 'English / IELTS', sub: 'Band 7+ Guaranteed', icon: BookOpen, color: 'from-teal-500 to-cyan-700' },
  { name: 'MDCAT / ECAT', sub: 'Entry Test Specialists', icon: Stethoscope, color: 'from-emerald-500 to-green-700' },
  { name: 'Urdu Literature', sub: 'FSc & BA Level', icon: PenTool, color: 'from-teal-600 to-emerald-700' },
];

const testimonials = [
  { name: 'Zara Khalid', role: 'NUST Student, Islamabad', avatar: 'https://i.pravatar.cc/60?u=zara', text: 'Thanks to Ayesha, I scored 95% in my ECAT! HighFive is genuinely the best tutoring platform in Pakistan.', rating: 5 },
  { name: 'Ali Hassan', role: 'Software Engineer, Lahore', avatar: 'https://i.pravatar.cc/60?u=ali', text: "Bilal taught me React from scratch and today I'm working at Systems Ltd. HighFive changed my career!", rating: 5 },
  { name: 'Sana Mehmood', role: 'FSc Student, Karachi', avatar: 'https://i.pravatar.cc/60?u=sana', text: "I got 7.5 in IELTS with Fatima's guidance. She is incredibly professional, patient and caring.", rating: 5 },
];

export default function Home() {
  const { openContactModal } = useGlobal();
  const featuredTutors = initialMockData.tutors.filter(t => t.isFeatured);

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── HERO ── */}
      <section className="hero-gradient text-white relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 hero-grid" />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-teal-600 rounded-full opacity-20 blur-3xl animate-aurora" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-700 rounded-full opacity-15 blur-3xl animate-aurora" style={{ animationDelay: '3s' }} />
        <div className="absolute top-10 left-1/3 w-64 h-64 bg-emerald-500 rounded-full opacity-10 blur-3xl animate-aurora" style={{ animationDelay: '6s' }} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              style={{ top: `${(i * 17 + 5) % 90}%`, left: `${(i * 23 + 8) % 95}%`, animation: 'float 4s ease-in-out infinite', animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
          <div className="animate-fade-in-down delay-100 inline-flex items-center gap-2 bg-white/[0.07] border border-white/15 rounded-full pl-2 pr-4 py-1.5 mb-8 text-sm font-medium text-emerald-100 backdrop-blur-sm">
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 rounded-full px-2 py-0.5 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live
            </span>
            Pakistan&apos;s #1 online tutoring platform
          </div>

          <h1 className="animate-fade-in-down delay-200 text-4xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight mb-6 leading-[1.05] max-w-4xl">
            <span className="block text-white">Find your perfect tutor.</span>
            <span className="block mt-2 text-white">
              Master{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-300 bg-clip-text text-transparent">
                <TypewriterText />
              </span>
            </span>
          </h1>

          <p className="animate-fade-in-down delay-400 text-base md:text-lg text-slate-300/90 mb-9 max-w-xl leading-relaxed">
            Connect with verified, top-rated tutors across Pakistan — MDCAT, ECAT,
            IELTS, coding and more. Learn online or in person, on your schedule.
          </p>

          <div className="animate-fade-in-down delay-500 w-full max-w-2xl bg-white rounded-2xl p-1.5 flex items-center shadow-[0_20px_60px_-15px_rgba(2,6,23,0.6)] mb-6 border border-white/10">
            <div className="pl-4 text-slate-400"><Search className="w-5 h-5" /></div>
            <input type="text" placeholder="What do you want to learn? e.g. Calculus, React, IELTS" className="flex-grow bg-transparent text-slate-800 px-4 py-3 outline-none text-base w-full placeholder:text-slate-400" />
            <Link href="/search" className="btn btn-primary px-7 py-3">
              Search
            </Link>
          </div>

          {/* Social proof */}
          <div className="animate-fade-in-down delay-500 flex items-center gap-3 mb-14 text-sm text-slate-300">
            <div className="flex -space-x-2">
              {['ayesha', 'bilal', 'fatima', 'usman'].map((u) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={u} src={`https://i.pravatar.cc/40?u=${u}`} alt="" className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover" />
              ))}
            </div>
            <span><span className="text-white font-semibold">5,000+ students</span> learning with HighFive</span>
          </div>

          <div className="animate-fade-in-down delay-600 grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-2xl px-4 py-5 text-center hover:bg-white/[0.1] transition-colors">
                <stat.icon className="w-5 h-5 text-emerald-300 mx-auto mb-2" />
                <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <TrustBar />

      {/* ── SUBJECTS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow justify-center mb-3">Explore</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">Popular Subjects</h2>
            <p className="text-slate-500">Pick your subject and find the perfect tutor</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {subjects.map((s, i) => (
              <Link key={i} href="/search" className={`card-hover bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white text-center flex flex-col items-center`}>
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                  <s.icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="font-bold text-sm mb-1">{s.name}</div>
                <div className="text-xs opacity-80">{s.sub}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED TUTORS ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-highfive-blue rounded-full px-4 py-1.5 text-sm font-semibold mb-3">
                <Star className="w-4 h-4 fill-current" /> Top Rated
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Our Best Tutors</h2>
              <p className="text-slate-500">Meet our highest-rated educators this month</p>
            </div>
            <Link href="/search" className="text-highfive-blue font-semibold hover:underline hidden sm:flex items-center gap-1">View all tutors →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTutors.map((tutor, i) => (
              <div key={tutor.id} className="animate-pop-in" style={{ animationDelay: `${i * 0.12}s` }}>
                <TutorCard tutor={tutor} />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/search" className="text-highfive-blue font-semibold hover:underline">View all tutors →</Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <Zap className="w-4 h-4" /> Simple & Fast
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">How HighFive Works</h2>
          <p className="text-slate-500 mb-16 max-w-2xl mx-auto">Get your dream education in just 5 simple steps</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { icon: Search, step: '01', title: 'Search', desc: 'Find a tutor by subject, budget and availability.', color: 'bg-emerald-50 text-emerald-600' },
              { icon: Target, step: '02', title: 'Match', desc: 'Align on your goals and pick the perfect schedule.', color: 'bg-teal-50 text-teal-600' },
              { icon: Video, step: '03', title: 'Connect', desc: 'Meet face-to-face in our Live Classroom.', color: 'bg-rose-50 text-rose-600' },
              { icon: BookOpen, step: '04', title: 'Learn', desc: 'Engage with interactive tools and resources.', color: 'bg-amber-50 text-amber-600' },
              { icon: TrendingUp, step: '05', title: 'Succeed', desc: 'Ace your exams and advance your career.', color: 'bg-green-50 text-green-600' },
            ].map((s, i) => (
              <div key={i} className="relative flex flex-col items-center">
                {i < 4 && <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-slate-200 z-0" />}
                <div className={`w-16 h-16 ${s.color} rounded-2xl flex items-center justify-center mb-4 relative z-10 card-hover shadow-sm`}>
                  <s.icon className="w-7 h-7" />
                </div>
                <div className="text-xs font-bold text-slate-400 mb-1">{s.step}</div>
                <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-teal-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-emerald-200 mb-4">
              <MessageCircle className="w-4 h-4" /> Student Reviews
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What Our Students Say</h2>
            <p className="text-emerald-300">Real success stories from real students across Pakistan</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl p-6 bg-white/[0.07] border border-white/10 backdrop-blur-sm hover:bg-white/[0.1] transition-colors">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-400 fill-current" />)}
                </div>
                <p className="text-slate-100 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border-2 border-emerald-400" />
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-emerald-300">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Simple, Transparent Pricing</h2>
            <p className="text-slate-500">No hidden fees. Only pay for the lessons you take.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm card-hover">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-highfive-blue" />
              </div>
              <h3 className="text-2xl font-bold text-highfive-blue mb-2">For Students</h3>
              <p className="text-slate-500 text-sm mb-6">Free to join and get started</p>
              <ul className="space-y-3 mb-8">
                {['Free registration & tutor search', 'Pay-per-lesson — no monthly fee', '100% money-back guarantee', 'Secure payment via JazzCash / EasyPaisa'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-success-green flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/search" className="block w-full bg-highfive-blue text-white text-center py-3 rounded-xl font-semibold hover:bg-emerald-800 transition-colors">
                Find a Tutor
              </Link>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-2xl p-8 border border-emerald-800 shadow-xl relative overflow-hidden card-hover">
              <div className="absolute top-0 right-0 bg-success-green text-white px-4 py-1 rounded-bl-xl font-bold text-xs tracking-wider">POPULAR</div>
              <div className="w-12 h-12 bg-emerald-800 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-success-green mb-2">For Tutors</h3>
              <p className="text-emerald-300 text-sm mb-6">Start earning today</p>
              <ul className="space-y-3 mb-8">
                {['Set your own hourly rate (Rs/hr)', 'Keep 85% of every lesson earned', 'Weekly payout via JazzCash / EasyPaisa', 'Free profile creation & listing'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white">
                    <ShieldCheck className="w-5 h-5 text-highfive-blue flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={openContactModal} className="w-full bg-success-green text-white text-center py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors btn-glow">
                Apply to Teach
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-highfive-blue">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Start Your Journey Today</h2>
          <p className="text-emerald-200 mb-8 text-lg">Thousands of students across Pakistan are already learning with HighFive</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search" className="bg-white text-highfive-blue px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg">
              Find a Tutor
            </Link>
            <button onClick={openContactModal} className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors">
              Sign Up for Free
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
