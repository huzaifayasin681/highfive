import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export type Step = { icon: LucideIcon; title: string; desc: string };

export default function HowItWorks({
  audience,
  intro,
  steps,
  ctaLabel,
  ctaHref,
}: {
  audience: string;
  intro: string;
  steps: Step[];
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="bg-white">
      <section className="hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-40" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-emerald-300 font-semibold uppercase tracking-widest text-xs mb-3">How it works</p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">For {audience}</h1>
          <p className="text-slate-300 text-lg">{intro}</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ol className="space-y-6">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-5 bg-white border border-slate-100 shadow-sm rounded-2xl p-6 card-hover">
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-50 text-highfive-blue rounded-2xl flex items-center justify-center">
                  <s.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-300 mt-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{s.title}</h3>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="text-center mt-12">
          <Link
            href={ctaHref}
            className="inline-block bg-highfive-blue text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-emerald-800 transition-colors shadow-sm"
          >
            {ctaLabel}
          </Link>
        </div>
      </section>
    </div>
  );
}
