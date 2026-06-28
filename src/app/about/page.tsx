import Link from "next/link";
import { Target, BookHeart, ShieldCheck, Users, GraduationCap, Star } from "lucide-react";
import { getContentMap } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Us — HighFive Tutors",
  description: "HighFive connects students across Pakistan with verified, high-quality tutors.",
};

const stats = [
  { value: "5,000+", label: "Students", icon: Users },
  { value: "500+", label: "Verified tutors", icon: GraduationCap },
  { value: "4.9★", label: "Average rating", icon: Star },
];

export default async function AboutPage() {
  const c = await getContentMap([
    "about_headline",
    "about_mission",
    "about_story",
    "about_safety",
  ]);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-40" />
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-teal-600 rounded-full opacity-20 blur-3xl animate-aurora" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-6 text-sm font-medium text-emerald-100">
            <BookHeart className="w-4 h-4 text-yellow-400" /> About HighFive
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            {c.about_headline ?? "Empowering Pakistan to learn"}
          </h1>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5 text-center">
              <s.icon className="w-5 h-5 text-highfive-blue mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <Block icon={Target} title="Our mission" body={c.about_mission} />
        <Block icon={BookHeart} title="Our story" body={c.about_story} />
        <Block icon={ShieldCheck} title="Trust & safety" body={c.about_safety} />
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Ready to get started?</h2>
          <p className="text-slate-500 mb-6">Join thousands of students and tutors across Pakistan.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/search" className="bg-highfive-blue text-white px-7 py-3 rounded-xl font-semibold hover:bg-emerald-800 transition-colors">
              Find a Tutor
            </Link>
            <Link href="/register" className="border border-slate-300 text-slate-700 px-7 py-3 rounded-xl font-semibold hover:border-highfive-blue hover:text-highfive-blue transition-colors">
              Become a Tutor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Block({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Target;
  title: string;
  body?: string;
}) {
  if (!body) return null;
  return (
    <div>
      <h2 className="flex items-center gap-2.5 text-xl font-bold text-slate-900 mb-3">
        <span className="w-9 h-9 bg-emerald-50 text-highfive-blue rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </span>
        {title}
      </h2>
      <p className="text-slate-600 leading-relaxed whitespace-pre-line">{body}</p>
    </div>
  );
}
