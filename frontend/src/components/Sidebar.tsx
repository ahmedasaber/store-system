import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  ShoppingBag,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Factory,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const navItems = [
    { path: '/', label: t('common.dashboard'), icon: LayoutDashboard },
    { path: '/categories', label: t('common.categories'), icon: Layers },
    { path: '/products', label: t('common.products'), icon: Package },
    { path: '/inventory', label: t('common.inventory'), icon: Warehouse },
    { path: '/sales', label: t('common.sales'), icon: ShoppingCart },
    { path: '/purchases', label: t('common.purchases'), icon: ShoppingBag },
    { path: '/reports', label: t('common.reports'), icon: BarChart3 },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 z-40 bg-slate-900 text-slate-100 border-e border-slate-800 transition-all duration-300 flex flex-col ${
        isRtl ? 'right-0' : 'left-0'
      } ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-3.5 border-b border-slate-800 shrink-0 justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shrink-0 shadow-md shadow-blue-500/20">
            <Factory className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <h1 className="text-sm font-bold text-white tracking-wide truncate">
                {t('common.appName')}
              </h1>
              <p className="text-[10px] text-slate-400 truncate">El-Ma3ras ERP</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle Footer */}
      <div className="p-2 border-t border-slate-800 shrink-0">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-semibold cursor-pointer"
          type="button"
          aria-label="Toggle Sidebar"
        >
          {isRtl ? (
            collapsed ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
          {!collapsed && <span>{isRtl ? 'تصغير القائمة' : 'Collapse Sidebar'}</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
