import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export const LanguageSwitch: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  const isArabic = i18n.language === 'ar';

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
      title={isArabic ? 'Switch to English' : 'التحويل للغة العربية'}
      type="button"
    >
      <Languages className="w-3.5 h-3.5 text-slate-500" />
      <span>{isArabic ? 'English' : 'العربية'}</span>
    </button>
  );
};

export default LanguageSwitch;
