import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit2, Trash2, Calendar, Tag, ChevronRight, ChevronLeft } from 'lucide-react';
import { CategoryItem } from '../../services/categoriesService.js';
import { EmptyState, ErrorState, LoadingScreen } from '../../components/ui/index.js';

interface CategoryListProps {
  categories: CategoryItem[];
  isLoading: boolean;
  isError: boolean;
  isAdmin: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (newPage: number) => void;
  onEdit: (category: CategoryItem) => void;
  onDelete: (category: CategoryItem) => void;
  onRetry: () => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  isLoading,
  isError,
  isAdmin,
  page,
  totalPages,
  total,
  onPageChange,
  onEdit,
  onDelete,
  onRetry,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  if (isLoading) {
    return <LoadingScreen message={t('categories.loading')} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={t('categories.errorTitle')}
        description={t('errors.globalErrorDesc')}
        onRetry={onRetry}
      />
    );
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={<Tag className="w-6 h-6 text-slate-400" />}
        title={t('categories.emptyTitle')}
        description={t('categories.emptyDesc')}
      />
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold">
                <th className="py-3 px-4 text-start">{t('categories.nameAr')}</th>
                <th className="py-3 px-4 text-start">{t('categories.nameEn')}</th>
                <th className="py-3 px-4 text-start">{t('categories.status')}</th>
                <th className="py-3 px-4 text-start">{t('categories.createdAt')}</th>
                {isAdmin && <th className="py-3 px-4 text-center">{t('categories.actions')}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Name AR */}
                  <td className="py-3.5 px-4 text-start">
                    <span className="font-bold text-slate-900">{category.nameAr}</span>
                  </td>

                  {/* Name EN */}
                  <td className="py-3.5 px-4 text-start text-slate-600 font-sans" dir="ltr">
                    {category.nameEn || '—'}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-start">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success-50 text-success-700 border border-success-500/20">
                      {t('categories.active')}
                    </span>
                  </td>

                  {/* Created At */}
                  <td className="py-3.5 px-4 text-start text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(category.createdAt)}</span>
                    </div>
                  </td>

                  {/* Actions (Admin Only) */}
                  {isAdmin && (
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEdit(category)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title={t('common.edit')}
                          type="button"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(category)}
                          className="p-1.5 text-slate-500 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors cursor-pointer"
                          title={t('common.delete')}
                          type="button"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50 text-xs">
            <span className="text-slate-500">
              {t('categories.pageInfo', { page, totalPages, total })}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                type="button"
              >
                {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                type="button"
              >
                {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
