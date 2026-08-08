import React from 'react';
import { useTranslation } from 'react-i18next';
import { Construction, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface PlaceholderPageProps {
  title?: string;
  moduleName?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, moduleName }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRtl = i18n.language === 'ar';

  const routeName = moduleName || location.pathname.replace('/', '').toUpperCase();

  return (
    <div className="bg-white rounded-2xl p-8 md:p-12 border border-slate-200/80 shadow-2xs text-center max-w-2xl mx-auto my-8 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/60 shadow-xs">
        <Construction className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
          {t('common.comingSoon')} • {routeName}
        </span>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">
          {title || `${t('common.underConstruction')} (${routeName})`}
        </h1>
        <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto">
          {t('common.underConstruction')}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t('common.goHome')}</span>
        </Link>
      </div>
    </div>
  );
};

export default PlaceholderPage;
