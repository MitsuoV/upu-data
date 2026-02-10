import React from 'react';
import { FilterState } from '../types';
import { Filter, X } from 'lucide-react';

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  institutions: string[];
  isOpen: boolean;
  onClose: () => void;
  resetFilters: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  filters, 
  setFilters, 
  institutions, 
  isOpen, 
  onClose,
}) => {
  const toggleInstitution = (inst: string) => {
    const current = filters.institutions;
    if (current.includes(inst)) {
      setFilters({ ...filters, institutions: current.filter(i => i !== inst) });
    } else {
      setFilters({ ...filters, institutions: [...current, inst] });
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto
          md:translate-x-0 md:static md:h-[calc(100vh-64px)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 space-y-8">
          
          <div className="flex items-center justify-between md:hidden">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Filter size={20} /> Filters
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
              <X size={20} />
            </button>
          </div>

          <div className="md:hidden hidden">
             {/* Spacer for structure if needed later */}
          </div>

          {/* Institutions Checkbox Group */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">
              Institutions
            </label>
            <div className="space-y-2 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
              {institutions.map(inst => (
                <label key={inst} className="flex items-start gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="relative flex items-center mt-0.5">
                    <input 
                      type="checkbox"
                      checked={filters.institutions.includes(inst)}
                      onChange={() => toggleInstitution(inst)}
                      className="peer h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 font-medium transition-colors leading-tight">
                    {inst}
                  </span>
                </label>
              ))}
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};