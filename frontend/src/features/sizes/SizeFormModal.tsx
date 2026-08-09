import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { X, Loader2 } from 'lucide-react';
import { SizeItem, SizeInput } from '../../services/sizesService.js';

const sizeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'اسم المقاس مطلوب' })
    .max(50, { message: 'اسم المقاس يجب ألا يتجاوز 50 حرف' }),
  sortOrder: z.coerce
    .number({ invalid_type_error: 'الترتيب يجب أن يكون عدداً' })
    .int({ message: 'الترتيب يجب أن يكون عدداً صحيحاً' })
    .min(0, { message: 'الترتيب يجب ألا يكون سالباً' }),
});

interface SizeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SizeInput) => Promise<void>;
  initialData?: SizeItem | null;
  isLoading?: boolean;
  serverError?: string | null;
}

export const SizeFormModal: React.FC<SizeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  serverError = null,
}) => {
  const { t } = useTranslation();
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SizeInput>({
    resolver: zodResolver(sizeSchema),
    defaultValues: {
      name: '',
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        sortOrder: initialData.sortOrder ?? 0,
      });
    } else {
      reset({
        name: '',
        sortOrder: 0,
      });
    }
    setLocalError(null);
  }, [initialData, isOpen, reset]);

  if (!isOpen) return null;

  const onFormSubmit = async (data: SizeInput) => {
    setLocalError(null);
    try {
      await onSubmit(data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'حدث خطأ أثناء الحفظ';
      setLocalError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800">
            {initialData ? t('sizes.editSize') : t('sizes.addSize')}
          </h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
          {(serverError || localError) && (
            <div className="p-3 bg-danger-50 border border-danger-200 text-danger-700 text-xs font-semibold rounded-xl">
              {serverError || localError}
            </div>
          )}

          {/* Size Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('sizes.name')} <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="مثال: M أو XL أو 42"
              className={`w-full px-3.5 py-2.5 bg-slate-50 border text-xs font-medium rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all ${
                errors.name ? 'border-danger-500' : 'border-slate-200'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-[11px] font-medium text-danger-600">{errors.name.message}</p>
            )}
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('sizes.sortOrder')} <span className="text-danger-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              {...register('sortOrder')}
              placeholder="0"
              className={`w-full px-3.5 py-2.5 bg-slate-50 border text-xs font-medium rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all ${
                errors.sortOrder ? 'border-danger-500' : 'border-slate-200'
              }`}
            />
            <p className="mt-1 text-[11px] text-slate-500">{t('sizes.sortOrderHelp')}</p>
            {errors.sortOrder && (
              <p className="mt-1 text-[11px] font-medium text-danger-600">{errors.sortOrder.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{t('common.save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SizeFormModal;
