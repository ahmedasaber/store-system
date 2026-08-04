import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sidebar } from '../components/Sidebar.js';
import { Topbar } from '../components/Topbar.js';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      {/* Collapsible Sidebar */}
      <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapse} />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${
          isRtl
            ? collapsed
              ? 'mr-16'
              : 'mr-64'
            : collapsed
            ? 'ml-16'
            : 'ml-64'
        }`}
      >
        <Topbar onToggleSidebar={toggleCollapse} />

        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
