import React from 'react';
import { ApplicantDetail } from '../types';
import { X, User, GraduationCap, CheckCircle, XCircle, FileText, School, Activity } from 'lucide-react';

interface ApplicantModalProps {
  applicant: ApplicantDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicantModal: React.FC<ApplicantModalProps> = ({ applicant, isOpen, onClose }) => {
  if (!isOpen || !applicant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className={`px-6 py-6 border-b border-slate-100 flex justify-between items-start ${applicant.isAccepted ? 'bg-emerald-50/50' : 'bg-slate-50'}`}>
           <div className="flex gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-sm ${applicant.isAccepted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                <User />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Applicant Profile</h2>
                <p className="text-sm text-slate-500 font-mono mt-1">{applicant.colB}</p>
                <div className="mt-2 flex gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${applicant.isAccepted ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {applicant.isAccepted ? <CheckCircle size={12}/> : <XCircle size={12}/>}
                    {applicant.isAccepted ? 'Accepted' : 'Rejected'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-600">
                    {applicant.colC}
                  </span>
                </div>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-slate-400 hover:text-slate-600">
             <X size={20} />
           </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Section: Academic Stats (B-G) */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <GraduationCap size={16} className="text-blue-500" /> Academic & Merit
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                <span className="text-[10px] font-bold text-amber-500 uppercase">Koko</span>
                <p className="text-xl font-bold text-slate-800 mt-1">{applicant.colD}</p>
              </div>
              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <span className="text-[10px] font-bold text-blue-500 uppercase">SPM A+</span>
                <p className="text-xl font-bold text-slate-800 mt-1">{applicant.colE}</p>
              </div>
              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <span className="text-[10px] font-bold text-blue-500 uppercase">SPM A</span>
                <p className="text-xl font-bold text-slate-800 mt-1">{applicant.colF}</p>
              </div>
              <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100">
                <span className="text-[10px] font-bold text-purple-500 uppercase">MUET</span>
                <p className="text-sm font-bold text-slate-800 mt-2 truncate">{applicant.colG}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section: Choices (H-J) */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText size={16} className="text-slate-500" /> Application Choices
              </h3>
              <ul className="space-y-4 relative">
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-200"></div>
                {[
                  { label: 'Choice 1', val: applicant.colH },
                  { label: 'Choice 2', val: applicant.colI },
                  { label: 'Choice 3', val: applicant.colJ }
                ].map((choice, idx) => (
                  <li key={idx} className="relative pl-8">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-500 z-10">
                      {idx + 1}
                    </div>
                    <p className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-wide">{choice.label}</p>
                    <p className="text-sm font-medium text-slate-800 leading-snug">{choice.val}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section: Result (L-M) */}
            <div className={`rounded-xl p-5 border flex flex-col ${applicant.isAccepted ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
               <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${applicant.isAccepted ? 'text-emerald-800' : 'text-red-800'}`}>
                <School size={16} /> Result
              </h3>
              
              <div className="mb-4 flex-1">
                <p className={`text-[10px] uppercase mb-1 ${applicant.isAccepted ? 'text-emerald-600' : 'text-red-500'}`}>Code</p>
                <div className="text-lg font-bold text-slate-900">
                  {applicant.colL}
                </div>
              </div>

              <div className="flex-1">
                <p className={`text-[10px] uppercase mb-1 ${applicant.isAccepted ? 'text-emerald-600' : 'text-red-500'}`}>Program</p>
                <div className="text-base font-medium text-slate-800">
                  {applicant.colM}
                </div>
              </div>
              
               <div className="mt-6 pt-4 border-t border-black/5">
                 <p className="text-[10px] uppercase text-slate-500 mb-1">Status</p>
                 <p className="text-sm font-mono text-slate-700">{applicant.colK || 'N/A'}</p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};