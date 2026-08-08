/**
 * Centralized TanStack Query key factory. Future queries/mutations must
 * reuse these instead of hardcoding key arrays inline.
 */
export const queryKeys = {
    auth: { me: ['auth', 'me'] as const },
    branches: {
      all: ['branches'] as const,
      detail: (id: string) => ['branches', id] as const,
    },
    users: {
      all: ['users'] as const,
      detail: (id: string) => ['users', id] as const,
    },
    categories: {
      all: ['categories'] as const,
      detail: (id: string) => ['categories', id] as const,
    },
    sizes: {
      all: ['sizes'] as const,
      detail: (id: string) => ['sizes', id] as const,
    },
    products: {
      all: ['products'] as const,
      detail: (id: string) => ['products', id] as const,
    },
    inventory: {
      all: ['inventory'] as const,
      byBranch: (branchId: string) => ['inventory', 'branch', branchId] as const,
    },
    customers: {
      all: ['customers'] as const,
      detail: (id: string) => ['customers', id] as const,
    },
    suppliers: {
      all: ['suppliers'] as const,
      detail: (id: string) => ['suppliers', id] as const,
    },
    sales: {
      all: ['sales'] as const,
      detail: (id: string) => ['sales', id] as const,
    },
    purchases: {
      all: ['purchases'] as const,
      detail: (id: string) => ['purchases', id] as const,
    },
    returns: {
      all: ['returns'] as const,
      detail: (id: string) => ['returns', id] as const,
    },
    expenses: {
      all: ['expenses'] as const,
      detail: (id: string) => ['expenses', id] as const,
    },
    reports: {
      all: ['reports'] as const,
      byRange: (startDate?: string, endDate?: string, branchId?: string) =>
        ['reports', { startDate, endDate, branchId }] as const,
    },
    dashboard: {
      summary: (branchId?: string) => ['dashboard', 'summary', branchId] as const,
    },
  } as const;