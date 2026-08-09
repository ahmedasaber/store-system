export interface SizeResponse {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateSizeInput {
  name: string;
  sortOrder: number;
}

export interface UpdateSizeInput {
  name: string;
  sortOrder: number;
}

export interface QuerySizesInput {
  search?: string;
  page?: number;
  limit?: number;
}
