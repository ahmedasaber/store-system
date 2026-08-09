import api from './api.js';

export interface SizeItem {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface QuerySizesParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface SizeInput {
  name: string;
  sortOrder: number;
}

export interface PaginatedSizesResponse {
  success: boolean;
  message: string;
  data: SizeItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const sizesService = {
  getSizes: async (params?: QuerySizesParams): Promise<PaginatedSizesResponse> => {
    const response = await api.get('/sizes', { params });
    return response.data;
  },

  getSizeById: async (id: string): Promise<SizeItem> => {
    const response = await api.get(`/sizes/${id}`);
    return response.data.data;
  },

  createSize: async (input: SizeInput): Promise<SizeItem> => {
    const response = await api.post('/sizes', input);
    return response.data.data;
  },

  updateSize: async (id: string, input: SizeInput): Promise<SizeItem> => {
    const response = await api.put(`/sizes/${id}`, input);
    return response.data.data;
  },

  deleteSize: async (id: string): Promise<void> => {
    await api.delete(`/sizes/${id}`);
  },
};
