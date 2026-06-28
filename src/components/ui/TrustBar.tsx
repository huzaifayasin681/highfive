import { GraduationCap } from 'lucide-react';

const UNIVERSITIES = [
  'NUST', 'LUMS', 'FAST-NUCES', 'UET Lahore', 'QAU Islamabad',
  'IBA Karachi', 'GIKI', 'COMSATS', 'Punjab University', 'Aga Khan University',
  'IIUI', 'Bahria University',
];

// Single seamless marquee track: render the list twice and translate by -50%.
export default function TrustBar() {
  const items = [...UNIVERSITIES, ...UNIVERSITIES];
  return (
    <section className="bg-white border-y border-slate-100 py-8">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">
        Tutors &amp; students from Pakistan&apos;s top institutions
      </p>
      <div className="marquee-mask overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-10">
          {items.map((u, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-slate-400 hover:text-highfive-blue transition-colors whitespace-nowrap"
            >
              <GraduationCap className="w-5 h-5" />
              <span className="font-extrabold text-lg tracking-tight">{u}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
