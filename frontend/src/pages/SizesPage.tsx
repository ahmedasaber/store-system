import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Ruler } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { queryKeys } from '../lib/queryKeys.js';
import {
  sizesService,
  SizeItem,
  SizeInput,
} from '../services/sizesService.js';
import SizeList from '../features/sizes/SizeList.js';
import SizeFormModal from '../features/sizes/SizeFormModal.js';
import DeleteSizeDialog from '../features/sizes/DeleteSizeDialog.js';

export const SizesPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isAdmin = user?.userType === 'ADMIN';

  // Search & Pagination States
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<SizeItem | null>(null);

  // Delete Dialog States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [sizeToDelete, setSizeToDelete] = useState<SizeItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset page on new search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch Sizes Query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [...queryKeys.sizes.all, { search: debouncedSearch, page }],
    queryFn: () =>
      sizesService.getSizes({
        search: debouncedSearch,
        page,
        limit: 10,
      }),
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (input: SizeInput) => sizesService.createSize(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sizes.all });
      setIsFormOpen(false);
      setSelectedSize(null);
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: SizeInput }) =>
      sizesService.updateSize(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sizes.all });
      setIsFormOpen(false);
      setSelectedSize(null);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => sizesService.deleteSize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sizes.all });
      setIsDeleteOpen(false);
      setSizeToDelete(null);
      setDeleteError(null);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'حدث خطأ أثناء حذف المقاس';
      setDeleteError(msg);
    },
  });

  // Modal Handlers
  const handleOpenCreate = () => {
    setSelectedSize(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (size: SizeItem) => {
    setSelectedSize(size);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (size: SizeItem) => {
    setSizeToDelete(size);
    setDeleteError(null);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (formData: SizeInput) => {
    if (selectedSize) {
      await updateMutation.mutateAsync({ id: selectedSize.id, input: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!sizeToDelete) return;
    await deleteMutation.mutateAsync(sizeToDelete.id);
  };

  const sizes = data?.data || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-xs">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">{t('sizes.title')}</h1>
            <p className="text-xs text-slate-500">
              كتالوج المقاسات الموحد لجميع الفروع
            </p>
          </div>
        </div>

        {/* Add Button (Admin Only) */}
        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs shadow-blue-500/20 transition-all cursor-pointer"
            type="button"
          >
            <Plus className="w-4 h-4" />
            <span>{t('sizes.addSize')}</span>
          </button>
        )}
      </div>

      {/* Toolbar / Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3 left-auto rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('sizes.searchPlaceholder')}
            className="w-full pr-9 pl-3.5 rtl:pr-9 rtl:pl-3.5 ltr:pl-9 ltr:pr-3.5 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Sizes List */}
      <SizeList
        sizes={sizes}
        isLoading={isLoading}
        isError={isError}
        isAdmin={isAdmin}
        page={page}
        totalPages={meta.totalPages}
        total={meta.total}
        onPageChange={(newPage) => setPage(newPage)}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onRetry={refetch}
      />

      {/* Form Modal */}
      <SizeFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedSize(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedSize}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Dialog */}
      <DeleteSizeDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSizeToDelete(null);
          setDeleteError(null);
        }}
        onConfirm={handleDeleteConfirm}
        size={sizeToDelete}
        isLoading={deleteMutation.isPending}
        error={deleteError}
      />
    </div>
  );
};

export default SizesPage;
