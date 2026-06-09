"use client";

import { useState } from 'react';
import { Search, SlidersHorizontal, X, Star, Users, BookOpen } from 'lucide-react';
import { useGlobal } from '@/context/GlobalContext';
import TutorCard from '@/components/ui/TutorCard';

const SUBJECT_PILLS = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English / IELTS', 'MDCAT / ECAT'];

export default function SearchPage() {
  const { state } = useGlobal();
  const [searchTerm, setSearchTerm] = useState('');
  const [activePill, setActivePill] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [showFilters, setShowFilters] = useState(false);

  const filteredTutors = state.tutors.filter(tutor => {
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPill = activePill === 'All' || tutor.subjects.some(s => s.toLowerCase().includes(activePill.toLowerCase()));
    const matchesPrice = tutor.rate <= maxPrice;
    return matchesSearch && matchesPill && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Page Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-blue-200 mb-5">
            <Users className="w-4 h-4" /> {state.tutors.length} Expert Tutors Available
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Find Your Perfect <span className="text-yellow-300">Tutor</span>
          </h1>
          <p className="text-slate-300 text-lg mb-8">
            Browse verified tutors across Pakistan. Filter by subject, price, and rating.
          </p>

          {/* Search input */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or subject..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-900 outline-none shadow-xl text-base placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Subject pills + filter toggle */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex flex-wrap gap-2 flex-grow">
            {SUBJECT_PILLS.map(pill => (
              <button
                key={pill}
                onClick={() => setActivePill(pill)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                  activePill === pill
                    ? 'bg-highfive-blue text-white border-highfive-blue shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-highfive-blue hover:text-highfive-blue'
                }`}
              >
                {pill}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white border border-slate-200 text-slate-600 hover:border-highfive-blue hover:text-highfive-blue transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Price filter panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900">Max Price: <span className="text-highfive-blue">Rs {maxPrice.toLocaleString()}/hr</span></h3>
              <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <input
              type="range" min="500" max="5000" step="100"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-highfive-blue"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Rs 500</span><span>Rs 5,000+</span>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-500 font-medium">
            Showing <span className="text-slate-900 font-bold">{filteredTutors.length}</span> tutor{filteredTutors.length !== 1 ? 's' : ''}
            {activePill !== 'All' && <span> in <span className="text-highfive-blue">{activePill}</span></span>}
          </p>
          {(searchTerm || activePill !== 'All' || maxPrice < 5000) && (
            <button onClick={() => { setSearchTerm(''); setActivePill('All'); setMaxPrice(5000); }} className="text-sm text-highfive-blue font-semibold hover:underline flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}
        </div>

        {/* Tutor grid */}
        {filteredTutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTutors.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No tutors found</h3>
            <p className="text-slate-500 mb-6">Try a different subject or adjust your budget.</p>
            <button onClick={() => { setSearchTerm(''); setActivePill('All'); setMaxPrice(5000); }} className="bg-highfive-blue text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors">
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
