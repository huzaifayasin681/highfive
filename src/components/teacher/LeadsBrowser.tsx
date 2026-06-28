"use client";

import { useMemo, useState } from "react";
import { Search, Inbox, MapPin, Wallet, Monitor, GraduationCap, Clock } from "lucide-react";
import type { Lead } from "@/lib/teacher";

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export default function LeadsBrowser({ leads }: { leads: Lead[] }) {
  const [term, setTerm] = useState("");
  const [location, setLocation] = useState("");

  const filtered = useMemo(
    () =>
      leads.filter((l) => {
        const t = term.toLowerCase();
        const matchesTerm =
          !t ||
          l.subject.toLowerCase().includes(t) ||
          l.description.toLowerCase().includes(t);
        const matchesLoc =
          !location ||
          (l.location ?? "").toLowerCase().includes(location.toLowerCase());
        return matchesTerm && matchesLoc;
      }),
    [leads, term, location]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Student Leads</h1>
        <p className="text-slate-500 mt-1">Open requirements posted by students looking for tutors.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search by subject or keyword…"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm"
          />
        </div>
        <div className="relative sm:w-64">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Filter by location"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-highfive-blue text-sm"
          />
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Showing <span className="font-bold text-slate-900">{filtered.length}</span> open lead
        {filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">No matching leads</h3>
          <p className="text-slate-500 text-sm">Try adjusting your search or check back later.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((l) => (
            <div key={l.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900">{l.subject}</h3>
                    {l.level && (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" /> {l.level}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Posted by {l.studentName} · {timeAgo(l.createdAt)}
                  </p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{l.description}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                {l.mode && (
                  <span className="flex items-center gap-1">
                    <Monitor className="w-3.5 h-3.5" /> {l.mode}
                  </span>
                )}
                {l.budget && (
                  <span className="flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5" /> {l.budget}
                  </span>
                )}
                {l.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {l.location}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
