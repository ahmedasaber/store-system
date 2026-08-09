import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit2, Trash2, Calendar, Ruler, ChevronRight, ChevronLeft } from 'lucide-react';
import { SizeItem } from '../../services/sizesService.js';
import { EmptyState, ErrorState, LoadingScreen } from '../../components/ui/index.js';

interface SizeListProps {
  sizes: SizeItem[];
  isLoading: boolean;
  isError: boolean;
  isAdmin: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (newPage: number) => void;
  onEdit: (size: SizeItem) => void;
  onDelete: (size: SizeItem) => void;
  onRetry: () => void;
}

export const SizeList: React.FC<SizeListProps> = ({
  sizes,
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
    return <LoadingScreen message={t('sizes.loading')} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={t('sizes.errorTitle')}
        description={t('errors.globalErrorDesc')}
        onRetry={onRetry}
      />
    );
  }

  if (sizes.length === 0) {
    return (
      <EmptyState
        icon={<Ruler className="w-6 h-6 text-slate-400" />}
        title={t('sizes.emptyTitle')}
        description={t('sizes.emptyDesc')}
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
                <th className="py-3 px-4 text-start">{t('sizes.name')}</th>
                <th className="py-3 px-4 text-start">{t('sizes.sortOrder')}</th>
                <th className="py-3 px-4 text-start">{t('sizes.status')}</th>
                <th className="py-3 px-4 text-start">{t('sizes.createdAt')}</th>
                {isAdmin && <th className="py-3 px-4 text-center">{t('sizes.actions')}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {sizes.map((size) => (
                <tr key={size.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Name */}
                  <td className="py-3.5 px-4 text-start">
                    <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60">
                      {size.name}
                    </span>
                  </td>

                  {/* Sort Order */}
                  <td className="py-3.5 px-4 text-start font-mono font-semibold text-slate-600">
                    {size.sortOrder}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-start">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success-50 text-success-700 border border-success-500/20">
                      {t('sizes.active')}
                    </span>
                  </td>

                  {/* Created At */}
                  <td className="py-3.5 px-4 text-start text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(size.createdAt)}</span>
                    </div>
                  </td>

                  {/* Actions (Admin Only) */}
                  {isAdmin && (
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEdit(size)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title={t('common.edit')}
                          type="button"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(size)}
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
              {t('sizes.pageInfo', { page, totalPages, total })}
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

export default SizeList;
