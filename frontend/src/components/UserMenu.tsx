import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User as UserIcon, LogOut, ChevronDown, Shield, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export const UserMenu: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const isAdmin = user.userType === 'ADMIN';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-1 px-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        type="button"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
          {getInitials(user.fullName || 'User')}
        </div>
        <div className="hidden sm:block text-start">
          <div className="text-xs font-bold text-slate-800 leading-tight">{user.fullName}</div>
          <div className="text-[10px] text-slate-500 font-medium">
            {isAdmin ? t('common.admin') : t('common.employee')}
          </div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1.5 ltr:right-0 rtl:left-0 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
          <div className="px-3.5 py-2 border-b border-slate-100 bg-slate-50/50">
            <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
            <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-500 truncate">
              <Mail className="w-3 h-3 shrink-0 text-slate-400" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1">
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                isAdmin ? 'bg-purple-50 text-purple-700 border border-purple-200/60' : 'bg-slate-100 text-slate-700'
              }`}>
                <Shield className="w-2.5 h-2.5" />
                {isAdmin ? t('common.admin') : t('common.employee')}
              </span>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full text-start px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold transition-colors cursor-pointer"
              type="button"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('common.logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
