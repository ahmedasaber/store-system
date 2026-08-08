import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { CategoryItem } from '../../services/categoriesService.js';

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  category: CategoryItem | null;
  isLoading?: boolean;
  error?: string | null;
}

export const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  category,
  isLoading = false,
  error = null,
}) => {
  const { t } = useTranslation();

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-slate-100 p-6 text-center animate-in fade-in zoom-in duration-200">
        <div className="w-12 h-12 rounded-2xl bg-danger-50 text-danger-600 flex items-center justify-center mx-auto mb-4 border border-danger-200/60">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-sm font-bold text-slate-800 mb-1">
          {t('categories.confirmDeleteTitle')}
        </h3>

        <p className="text-xs text-slate-500 mb-4">
          {t('categories.confirmDeleteMessage', { name: category.nameAr })}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-danger-50 border border-danger-200 text-danger-700 text-xs font-semibold rounded-xl text-start">
            {error}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-white bg-danger-600 hover:bg-danger-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{t('common.delete')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryDialog;
