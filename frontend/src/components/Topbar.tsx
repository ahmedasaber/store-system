import React from 'react';
import { Menu } from 'lucide-react';
import { BranchSelector } from './BranchSelector.js';
import { LanguageSwitch } from './LanguageSwitch.js';
import { UserMenu } from './UserMenu.js';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
          type="button"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Branch Selector */}
        <BranchSelector />
      </div>

      <div className="flex items-center gap-3">
        {/* Language Switch */}
        <LanguageSwitch />

        <div className="h-4 w-px bg-slate-200 mx-0.5" />

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
};

export default Topbar;
