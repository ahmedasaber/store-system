import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Layers } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { queryKeys } from '../lib/queryKeys.js';
import {
  categoriesService,
  CategoryItem,
  CategoryInput,
} from '../services/categoriesService.js';
import CategoryList from '../features/categories/CategoryList.js';
import CategoryFormModal from '../features/categories/CategoryFormModal.js';
import DeleteCategoryDialog from '../features/categories/DeleteCategoryDialog.js';

export const CategoriesPage: React.FC = () => {
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
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);

  // Delete Dialog States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset page on new search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch Categories Query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [...queryKeys.categories.all, { search: debouncedSearch, page }],
    queryFn: () =>
      categoriesService.getCategories({
        search: debouncedSearch,
        page,
        limit: 10,
      }),
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (input: CategoryInput) => categoriesService.createCategory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      setIsFormOpen(false);
      setSelectedCategory(null);
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CategoryInput }) =>
      categoriesService.updateCategory(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      setIsFormOpen(false);
      setSelectedCategory(null);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      setIsDeleteOpen(false);
      setCategoryToDelete(null);
      setDeleteError(null);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'حدث خطأ أثناء حذف التصنيف';
      setDeleteError(msg);
    },
  });

  // Modal Handlers
  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category: CategoryItem) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (input: CategoryInput) => {
    if (selectedCategory) {
      await updateMutation.mutateAsync({ id: selectedCategory.id, input });
    } else {
      await createMutation.mutateAsync(input);
    }
  };

  // Delete Handlers
  const handleOpenDelete = (category: CategoryItem) => {
    setCategoryToDelete(category);
    setDeleteError(null);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      setDeleteError(null);
      await deleteMutation.mutateAsync(categoryToDelete.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">{t('categories.title')}</h1>
            <p className="text-xs text-slate-500">
              إدارة أقسام وتصنيفات المنتجات العامة للنظام
            </p>
          </div>
        </div>

        {/* Create Action Button (Admin Only) */}
        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs shadow-blue-500/20 transition-all cursor-pointer shrink-0"
            type="button"
          >
            <Plus className="w-4 h-4" />
            <span>{t('categories.addCategory')}</span>
          </button>
        )}
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute inset-s-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('categories.searchPlaceholder')}
            className="w-full ps-10 pe-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Categories Table List */}
      <CategoryList
        categories={data?.data || []}
        isLoading={isLoading}
        isError={isError}
        isAdmin={isAdmin}
        page={page}
        totalPages={data?.meta?.totalPages || 1}
        total={data?.meta?.total || 0}
        onPageChange={(newPage) => setPage(newPage)}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onRetry={() => refetch()}
      />

      {/* Form Modal */}
      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedCategory}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteCategoryDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        category={categoryToDelete}
        isLoading={deleteMutation.isPending}
        error={deleteError}
      />
    </div>
  );
};

export default CategoriesPage;
