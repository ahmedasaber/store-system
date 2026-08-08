import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Factory, Lock, Mail, AlertCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { LanguageSwitch } from '../components/LanguageSwitch.js';

export const LoginPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const isRtl = i18n.language === 'ar';

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const loginSchema = z.object({
    email: z
      .string()
      .min(1, t('auth.emailRequired'))
      .email(t('auth.invalidEmail')),
    password: z
      .string()
      .min(1, t('auth.passwordRequired'))
      .min(6, t('auth.passwordMinLength')),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@erp.com',
      password: 'Admin@123',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login(values);
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || t('auth.invalidCredentials');
      setServerError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative font-sans text-slate-900">
      {/* Top Bar with Language Switcher */}
      <div className="absolute top-6 ltr:right-6 rtl:left-6">
        <LanguageSwitch />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 mb-4">
          <Factory className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {t('common.appName')}
        </h2>
        <p className="mt-2 text-xs text-slate-500 font-medium max-w-sm mx-auto">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-200/80 rounded-2xl">
          {serverError && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t('auth.emailLabel')}
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3 rtl:pr-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`block w-full text-xs rounded-xl border py-2.5 ltr:pl-9 rtl:pr-9 ltr:pr-3 rtl:pl-3 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all ${
                    errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-blue-600'
                  }`}
                  placeholder={t('auth.emailPlaceholder')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t('auth.passwordLabel')}
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-3 rtl:pr-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className={`block w-full text-xs rounded-xl border py-2.5 ltr:pl-9 rtl:pr-9 ltr:pr-3 rtl:pl-3 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all ${
                    errors.password ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-blue-600'
                  }`}
                  placeholder={t('auth.passwordPlaceholder')}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Default credentials tip */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <p className="font-semibold text-slate-700">بيانات المسؤول الافتراضية / Default Admin:</p>
              <div className="flex items-center justify-between">
                <span>admin@erp.com</span>
                <button
                  type="button"
                  onClick={() => {
                    setValue('email', 'admin@erp.com');
                    setValue('password', 'Admin@123');
                  }}
                  className="text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  تعبئة تلقائية
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('auth.loggingIn')}</span>
                </>
              ) : (
                <>
                  <span>{t('auth.loginButton')}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-400">
          {t('common.allRightsReserved', { year: new Date().getFullYear() })}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
