import React, { useState, useEffect, useMemo } from 'react';
import { Course, ApplicantStats, FilterState, SortField, SortOrder } from '../types';
import { loadData, parseExcel } from '../services/dataLoader';
import { CourseCard } from './CourseCard';
import { Sidebar } from './Sidebar';
import { Search, Menu, Upload, ArrowUp, ArrowDown, Database, Loader2 } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  institutions: [],
};

export const Dashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Record<string, ApplicantStats>>({});
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [sortField, setSortField] = useState<SortField>('applicants');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { courses: loadedCourses, stats: loadedStats } = await loadData();
        
        if (loadedCourses.length > 0) {
          setCourses(loadedCourses);
          setStats(loadedStats);
        } else {
          setLoadingError(true);
        }
      } catch (err) {
        console.error(err);
        setLoadingError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const allInstitutions = useMemo(() => {
    return Array.from(new Set(courses.map(c => c.institution))).sort();
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
                            course.code.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      const matchesInstitution = filters.institutions.length === 0 || filters.institutions.includes(course.institution);
      
      return matchesSearch && matchesInstitution;
    }).sort((a, b) => {
      let valA: number | string = '';
      let valB: number | string = '';

      switch (sortField) {
        case 'applicants':
          valA = a.totalApplicants;
          valB = b.totalApplicants;
          break;
        case 'rate':
          valA = a.acceptanceRate;
          valB = b.acceptanceRate;
          break;
        case 'quota':
          valA = a.quota;
          valB = b.quota;
          break;
        case 'name':
          valA = a.name;
          valB = b.name;
          break;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [courses, filters, sortField, sortOrder]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        if (bstr) {
            const { courses: loadedCourses, stats: loadedStats } = parseExcel(bstr as string);
            setCourses(loadedCourses);
            setStats(loadedStats);
            alert(`Successfully loaded ${loadedCourses.length} unique courses from "${file.name}"`);
        }
      } catch (error) {
        console.error("Error reading file", error);
        alert("Failed to parse Excel file. Ensure it is a valid format.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      <Sidebar 
        filters={filters} 
        setFilters={setFilters} 
        institutions={allInstitutions}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        resetFilters={resetFilters}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 hover:bg-slate-100 rounded-md md:hidden"
            >
              <Menu size={20} className="text-slate-600" />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800 hidden sm:block tracking-tight">UPU Analytics 2025</h1>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-4 lg:mx-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search programs, codes, or universities..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white border focus:border-primary-500 rounded-lg text-sm transition-all outline-none"
                value={filters.searchQuery}
                onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
             {/* Header Buttons Removed */}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                {loading ? <><Loader2 className="animate-spin" size={24}/> Parsing Applicants...</> : `${filteredCourses.length} Programs`}
              </h2>
              {!loading && <p className="text-slate-500 text-sm">Aggregated from raw applicant data rows.</p>}
            </div>
            
            <div className="flex items-center gap-2 text-sm bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
               <span className="px-2 text-slate-500 font-medium border-r border-slate-100 mr-1">Sort</span>
               {[
                 { id: 'applicants', label: 'Applicants' },
                 { id: 'rate', label: 'Acceptance' },
                 { id: 'name', label: 'Name' },
               ].map((opt) => (
                 <button
                   key={opt.id}
                   onClick={() => toggleSort(opt.id as SortField)}
                   className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${sortField === opt.id ? 'bg-primary-50 text-primary-700 font-semibold shadow-inner' : 'text-slate-600 hover:bg-slate-50'}`}
                 >
                   {opt.label}
                   {sortField === opt.id && (
                     sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                   )}
                 </button>
               ))}
            </div>
          </div>

          {!loading && loadingError && courses.length === 0 && (
             <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                <Database size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No data found in source</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">We couldn't parse the applicant list. Please upload your Excel file directly.</p>
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold cursor-pointer hover:bg-primary-700 transition-all shadow-lg shadow-primary-100">
                  <Upload size={18} /> Choose Excel File
                  <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
                </label>
             </div>
          )}

          {loading ? (
             <div className="space-y-4">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="h-28 bg-white rounded-xl border border-slate-100 animate-pulse"></div>
               ))}
             </div>
          ) : (
            <div className="space-y-4 pb-12">
              {filteredCourses.length > 0 ? (
                filteredCourses.map(course => (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    stats={stats[course.id]} 
                  />
                ))
              ) : (
                !loadingError && (
                  <div className="text-center py-24 bg-white rounded-2xl border border-slate-100">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Search size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">No matching programs</h3>
                    <p className="text-slate-500 mt-1">Try different search terms or clear your filters.</p>
                    <button onClick={resetFilters} className="mt-6 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">Clear all filters</button>
                  </div>
                )
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};