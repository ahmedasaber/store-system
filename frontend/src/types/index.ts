export type UserType = 'ADMIN' | 'EMPLOYEE';

export type PaymentStatus = 'PAID' | 'PARTIALLY_PAID' | 'UNPAID';

export type PaymentMethod = 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'OTHER';

export type TransferStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export type MovementType =
  | 'SALE'
  | 'PURCHASE'
  | 'RETURN'
  | 'TRANSFER_IN'
  | 'TRANSFER_OUT'
  | 'ADJUSTMENT';

export interface User {
  id: string;
  fullName: string;
  email: string;
  userType: UserType;
  isActive: boolean;
  assignedBranches?: Branch[];
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Size {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSize {
  id: string;
  productId: string;
  sizeId: string;
  sku: string;
  barcode?: string;
  purchasePrice: number;
  retailPrice: number;
  wholesalePrice: number;
  minimumRetailPrice: number;
  isActive: boolean;
  size?: Size;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  categoryId: string;
  isService: boolean;
  description?: string;
  isActive: boolean;
  category?: Category;
  productSizes?: ProductSize[];
  createdAt: string;
  updatedAt: string;
}

export interface BranchInventory {
  id: string;
  branchId: string;
  productSizeId: string;
  quantity: number;
  productSize?: ProductSize;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  taxNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  companyName?: string;
  taxNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSetting {
  id: string;
  companyName: string;
  companyLogo?: string;
  currency: string;
  defaultTaxRate: number;
  phone?: string;
  address?: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}
