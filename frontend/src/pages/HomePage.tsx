import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  Building2,
  ShieldCheck,
  Languages,
  Layers,
  ArrowUpRight,
  Package,
  Warehouse,
  ShoppingCart,
  ShoppingBag,
  BarChart3,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, activeBranch } = useAuth();

  const placeholderModules = [
    { name: t('common.products'), path: '/products', icon: Package, phase: 'Phase 2B' },
    { name: t('common.inventory'), path: '/inventory', icon: Warehouse, phase: 'Phase 2B' },
    { name: t('common.sales'), path: '/sales', icon: ShoppingCart, phase: 'Phase 2C' },
    { name: t('common.purchases'), path: '/purchases', icon: ShoppingBag, phase: 'Phase 2C' },
    { name: t('common.reports'), path: '/reports', icon: BarChart3, phase: 'Phase 2D' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl border border-emerald-100 shadow-2xs">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                {t('common.welcomeUser', { name: user?.fullName })}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">{t('common.systemReady')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60 inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Phase 2A Foundation Active</span>
            </span>
          </div>
        </div>

        {/* User & Active Branch Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60">
            <span className="text-slate-400 font-semibold block text-[11px] mb-0.5">
              {t('auth.emailLabel')}
            </span>
            <span className="font-bold text-slate-800 truncate block">{user?.email}</span>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60">
            <span className="text-slate-400 font-semibold block text-[11px] mb-0.5">
              {t('common.activeBranch')}
            </span>
            <span className="font-bold text-blue-700 truncate flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              {activeBranch?.name || t('common.noBranch')}
            </span>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60">
            <span className="text-slate-400 font-semibold block text-[11px] mb-0.5">
              {t('common.users')}
            </span>
            <span className="font-bold text-purple-700 inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {user?.userType === 'ADMIN' ? t('common.admin') : t('common.employee')}
            </span>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60">
            <span className="text-slate-400 font-semibold block text-[11px] mb-0.5">
              {t('common.language')}
            </span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              {i18n.language === 'ar' ? 'العربية (RTL)' : 'English (LTR)'}
            </span>
          </div>
        </div>
      </div>

      {/* Tech Stack Readiness Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">React 19 + Vite Frontend</h3>
          <p className="text-xs text-slate-500">
            Strict TypeScript configuration with TailwindCSS styling, Lucide icons, and responsive layouts.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">JWT & AuthContext</h3>
          <p className="text-xs text-slate-500">
            Automatic JWT token persistence, active branch header routing, and protected routes guard.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Languages className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Dual Language i18n</h3>
          <p className="text-xs text-slate-500">
            Full support for Arabic (RTL default) and English (LTR) with seamless direction switching.
          </p>
        </div>
      </div>

      {/* Future Roadmap Modules */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">الوحدات القادمة في المراحل التالية</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Module routes configured with protected access. Click any card to inspect the placeholder route.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {placeholderModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.path}
                to={mod.path}
                className="p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl flex flex-col justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-white rounded-lg text-blue-600 border border-slate-200/60 shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600">
                    {mod.phase}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                    <span>{mod.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">{t('common.comingSoon')}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
