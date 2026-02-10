import React, { useState } from 'react';
import { Course, ApplicantStats, ApplicantDetail } from '../types';
import { ChevronDown, ChevronUp, Users, ClipboardList, Eye } from 'lucide-react';
import { SPMChart, MUETChart } from './Charts';
import { ApplicantModal } from './ApplicantModal';

interface CourseCardProps {
  course: Course;
  stats?: ApplicantStats;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, stats }) => {
  const [expanded, setExpanded] = useState(false);
  const [applicantFilter, setApplicantFilter] = useState<'all' | 'accepted' | 'rejected'>('all');
  
  // Modal State
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredApplicants = (course.applicantsList || []).filter(app => {
    if (applicantFilter === 'accepted') return app.isAccepted;
    if (applicantFilter === 'rejected') return !app.isAccepted;
    return true;
  });

  const handleViewProfile = (app: ApplicantDetail, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedApplicant(app);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div 
          className="p-6 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {course.code}
                </span>
                <span className="text-xs text-slate-500">{course.institution}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 leading-tight">{course.name}</h3>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Total Apps</p>
                <div className="flex items-center gap-1 font-semibold text-slate-700">
                  <Users size={16} className="text-blue-500" />
                  {course.totalApplicants.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Success Rate</p>
                <div className={`flex items-center gap-1 font-bold ${course.acceptanceRate < 15 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {course.acceptanceRate.toFixed(1)}%
                </div>
              </div>
              <div className="text-slate-400">
                {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
          </div>
          
          {/* Simple Progress Bar */}
          <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500" 
              style={{ width: `${course.acceptanceRate}%` }} 
            />
          </div>
        </div>

        {expanded && (
          <div className="border-t border-slate-100 bg-slate-50 p-6 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <SPMChart stats={stats!} />
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <MUETChart stats={stats!} />
              </div>
            </div>

            {/* Individual Applicant List with Columns B-M */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <ClipboardList size={18} className="text-primary-600" /> Applicant Registry
                </h4>
                
                <div className="flex bg-white rounded-lg border border-slate-200 p-0.5 shadow-sm text-xs">
                  {(['all', 'accepted', 'rejected'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setApplicantFilter(mode)}
                      className={`px-3 py-1.5 rounded-md capitalize transition-all ${applicantFilter === mode ? 'bg-primary-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-100">
                      <th className="px-3 py-3 border-r border-slate-100 w-10">View</th>
                      <th className="px-3 py-3 border-r border-slate-100">Koko</th>
                      <th className="px-3 py-3 border-r border-slate-100 font-bold bg-slate-100/50">SPM A+</th>
                      <th className="px-3 py-3 border-r border-slate-100">SPM A</th>
                      <th className="px-3 py-3 border-r border-slate-100">MUET</th>
                      <th className="px-3 py-3 border-r border-slate-100">Choice 1</th>
                      <th className="px-3 py-3 border-r border-slate-100 bg-emerald-50/50">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                    {filteredApplicants.length > 0 ? (
                      filteredApplicants.map((app) => (
                        <tr key={app.id} className={`hover:bg-slate-50 transition-colors ${app.isAccepted ? 'bg-emerald-50/10' : ''}`}>
                          <td className="px-3 py-2 border-r border-slate-50 text-center">
                            <button 
                              onClick={(e) => handleViewProfile(app, e)}
                              className="p-1.5 hover:bg-primary-50 text-slate-400 hover:text-primary-600 rounded transition-colors"
                              title="View Full Profile"
                            >
                              <Eye size={14} />
                            </button>
                          </td>
                          <td className="px-3 py-2 border-r border-slate-50 font-medium" title={app.colD}>{app.colD}</td>
                          <td className="px-3 py-2 border-r border-slate-50 font-bold text-center" title={app.colE}>{app.colE}</td>
                          <td className="px-3 py-2 border-r border-slate-50 text-center" title={app.colF}>{app.colF}</td>
                          <td className="px-3 py-2 border-r border-slate-50" title={app.colG}>{app.colG}</td>
                          <td className="px-3 py-2 border-r border-slate-50 max-w-[150px] truncate" title={app.colH}>{app.colH}</td>
                          <td className="px-3 py-2 font-semibold text-slate-800 max-w-[150px] truncate" title={`${app.colL} ${app.colM}`}>
                             {app.colL} {app.colM}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic text-sm">
                          No applicants found for this criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <ApplicantModal 
          applicant={selectedApplicant} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </>
  );
};