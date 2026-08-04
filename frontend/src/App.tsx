import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Building2, Layers, Package, ShoppingCart, Users } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function BootstrapWelcome() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-500/20">
              M
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {t('common.appName')}
              </h1>
              <p className="text-sm text-slate-500">Phase 1A: Monorepo Workspace Finalized</p>
            </div>
          </div>
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-colors border border-slate-300"
          >
            {i18n.language === 'ar' ? 'English (LTR)' : 'العربية (RTL)'}
          </button>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-500">Structure</h2>
              <p className="text-lg font-bold text-slate-800">Independent Monorepo</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-500">Backend API</h2>
              <p className="text-lg font-bold text-slate-800">Express App Initialized</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-500">Frontend</h2>
              <p className="text-lg font-bold text-slate-800">React + Vite + i18n</p>
            </div>
          </div>
        </div>

        {/* Modules Overview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3 border-slate-100">
            Registered Modules & Architecture Roadmap
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm font-medium">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              <span>{t('common.branches')}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              <span>{t('common.users')}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-500" />
              <span>{t('common.products')} & {t('common.sizes')}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-rose-500" />
              <span>{t('common.sales')} & {t('common.purchases')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BootstrapWelcome />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
