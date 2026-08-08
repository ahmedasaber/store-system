export interface BranchStorage {
    getActiveBranchId(): string | null;
    setActiveBranchId(branchId: string): void;
    clearActiveBranchId(): void;
  }
  
  const ACTIVE_BRANCH_KEY = 'el_ma3ras_active_branch';
  
  class LocalStorageBranchStorage implements BranchStorage {
    getActiveBranchId(): string | null {
      return localStorage.getItem(ACTIVE_BRANCH_KEY);
    }
    setActiveBranchId(branchId: string): void {
      localStorage.setItem(ACTIVE_BRANCH_KEY, branchId);
    }
    clearActiveBranchId(): void {
      localStorage.removeItem(ACTIVE_BRANCH_KEY);
    }
  }
  
  export const branchStorage: BranchStorage = new LocalStorageBranchStorage();