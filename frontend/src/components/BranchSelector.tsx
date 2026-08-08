import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export const BranchSelector: React.FC = () => {
  const { t } = useTranslation();
  const { user, activeBranchId, setActiveBranchId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const assignedBranches = user?.assignedBranches || [];
  const activeBranchName = user?.assignedBranches?.find((b) => b.id === activeBranchId)?.name;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!assignedBranches || assignedBranches.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-medium border border-slate-200">
        <Building2 className="w-4 h-4 text-slate-400" />
        <span>{t('common.noBranch')}</span>
      </div>
    );
  }

  // If user only has 1 branch, display as a clean static badge
  if (assignedBranches.length === 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-200/60 shadow-xs">
        <Building2 className="w-4 h-4 text-blue-600" />
        <span className="font-semibold">{activeBranchName || assignedBranches[0].name}</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 shadow-xs transition-colors cursor-pointer"
        type="button"
        aria-expanded={isOpen}
      >
        <Building2 className="w-4 h-4 text-blue-600" />
        <span className="max-w-[120px] truncate font-semibold">{activeBranchName || t('common.selectBranch')}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1.5 ltr:right-0 rtl:left-0 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            {t('common.activeBranch')}
          </div>
          {assignedBranches.map((branch) => {
            const isSelected = activeBranchId === branch.id;
            return (
              <button
                key={branch.id}
                onClick={() => {
                  setActiveBranchId(branch.id);
                  setIsOpen(false);
                }}
                className={`w-full text-start px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                  isSelected ? 'bg-blue-50/70 text-blue-700 font-semibold' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  <span className="truncate">{branch.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BranchSelector;
