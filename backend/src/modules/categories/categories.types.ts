export interface CategoryResponse {
    id: string;
    nameAr: string;
    nameEn: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }
  
  export interface CreateCategoryInput {
    nameAr: string;
    nameEn: string;
  }
  
  export interface UpdateCategoryInput {
    nameAr: string;
    nameEn: string;
  }
  
  export interface QueryCategoriesInput {
    search?: string;
    page?: number;
    limit?: number;
  }