"use client";

import { useState } from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { useGlobal } from '@/context/GlobalContext';
import TutorCard from '@/components/ui/TutorCard';

export default function SearchPage() {
  const { state } = useGlobal();
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const allSubjects = Array.from(new Set(state.tutors.flatMap(t => t.subjects)));

  const filteredTutors = state.tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tutor.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = subjectFilter.length === 0 || tutor.subjects.some(s => subjectFilter.includes(s));
    const matchesPrice = tutor.rate <= maxPrice;
    
    return matchesSearch && matchesSubject && matchesPrice;
  });

  const handleSubjectChange = (subject: string) => {
    setSubjectFilter(prev => 
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 min-h-screen">
      {/* Mobile filter toggle */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Find Tutors</h1>
        <button 
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center space-x-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Sidebar Filters */}
      <div className={`
        fixed inset-0 z-50 bg-white md:bg-transparent md:static md:w-64 flex-shrink-0 flex flex-col
        ${isMobileFiltersOpen ? 'block' : 'hidden md:flex'}
      `}>
        <div className="p-4 md:p-0 border-b border-slate-200 md:border-0 flex justify-between items-center md:hidden mb-4">
          <h2 className="text-xl font-bold text-slate-900">Filters</h2>
          <button onClick={() => setIsMobileFiltersOpen(false)} className="text-slate-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 md:p-0 overflow-y-auto flex-grow space-y-8">
          <div>
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
              <Filter className="w-4 h-4 mr-2 text-highfive-blue" />
              Subjects
            </h3>
            <div className="space-y-3">
              {allSubjects.map(subject => (
                <label key={subject} className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={subjectFilter.includes(subject)}
                    onChange={() => handleSubjectChange(subject)}
                    className="w-4 h-4 text-highfive-blue rounded border-slate-300 focus:ring-highfive-blue"
                  />
                  <span className="text-slate-700">{subject}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Max Price: Rs {maxPrice}/hr</h3>
            <input 
              type="range" 
              min="500" max="5000" step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-highfive-blue"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Rs 500</span>
              <span>Rs 5,000+</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 md:p-0 mt-auto md:mt-8 md:hidden">
          <button 
            onClick={() => setIsMobileFiltersOpen(false)}
            className="w-full bg-highfive-blue text-white py-3 rounded-lg font-bold"
          >
            Show {filteredTutors.length} Tutors
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        <h1 className="text-3xl font-bold text-slate-900 mb-6 hidden md:block">Find Tutors</h1>
        
        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-highfive-blue focus:border-highfive-blue text-slate-900"
          />
        </div>

        {/* Results */}
        <div className="mb-4 text-slate-600 font-medium">
          Showing {filteredTutors.length} tutor{filteredTutors.length !== 1 ? 's' : ''}
        </div>

        {filteredTutors.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredTutors.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No tutors found</h3>
            <p className="text-slate-500">Try adjusting your filters or search term.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSubjectFilter([]); setMaxPrice(2000); }}
              className="mt-6 text-highfive-blue font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
