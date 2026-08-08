import api from './api.js';

export interface CategoryItem {
  id: string;
  nameAr: string;
  nameEn: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface QueryCategoriesParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CategoryInput {
  nameAr: string;
  nameEn: string;
}

export interface PaginatedCategoriesResponse {
  success: boolean;
  message: string;
  data: CategoryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const categoriesService = {
  getCategories: async (params?: QueryCategoriesParams): Promise<PaginatedCategoriesResponse> => {
    const response = await api.get('/categories', { params });
    return response.data;
  },

  getCategoryById: async (id: string): Promise<CategoryItem> => {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
  },

  createCategory: async (input: CategoryInput): Promise<CategoryItem> => {
    const response = await api.post('/categories', input);
    return response.data.data;
  },

  updateCategory: async (id: string, input: CategoryInput): Promise<CategoryItem> => {
    const response = await api.put(`/categories/${id}`, input);
    return response.data.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
