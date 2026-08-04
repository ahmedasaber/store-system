import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import authService, { UserAuthProfile, AssignedBranchInfo, LoginCredentials } from '../services/authService.js';

interface AuthContextType {
  user: UserAuthProfile | null;
  token: string | null;
  activeBranch: AssignedBranchInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  setActiveBranch: (branch: AssignedBranchInfo) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAuthProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('el_ma3ras_token'));
  const [activeBranch, setActiveBranchState] = useState<AssignedBranchInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to determine initial active branch
  const syncActiveBranch = useCallback((userData: UserAuthProfile) => {
    const savedBranchId = localStorage.getItem('el_ma3ras_active_branch');
    const branches = userData.assignedBranches || [];

    if (savedBranchId && branches.some((b) => b.id === savedBranchId)) {
      const match = branches.find((b) => b.id === savedBranchId)!;
      setActiveBranchState(match);
    } else if (branches.length > 0) {
      setActiveBranchState(branches[0]);
      localStorage.setItem('el_ma3ras_active_branch', branches[0].id);
    } else {
      setActiveBranchState(null);
      localStorage.removeItem('el_ma3ras_active_branch');
    }
  }, []);

  // Set active branch manually
  const setActiveBranch = useCallback((branch: AssignedBranchInfo) => {
    setActiveBranchState(branch);
    localStorage.setItem('el_ma3ras_active_branch', branch.id);
  }, []);

  // Fetch /auth/me on app startup if token exists
  const refreshUser = useCallback(async () => {
    const existingToken = localStorage.getItem('el_ma3ras_token');
    if (!existingToken) {
      setUser(null);
      setToken(null);
      setActiveBranchState(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setToken(existingToken);
      syncActiveBranch(userData);
    } catch {
      // Token invalid or expired
      localStorage.removeItem('el_ma3ras_token');
      localStorage.removeItem('el_ma3ras_active_branch');
      setUser(null);
      setToken(null);
      setActiveBranchState(null);
    } finally {
      setIsLoading(false);
    }
  }, [syncActiveBranch]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('el_ma3ras_token', data.accessToken);
      setToken(data.accessToken);
      setUser(data.user);
      syncActiveBranch(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('el_ma3ras_token');
      localStorage.removeItem('el_ma3ras_active_branch');
      setUser(null);
      setToken(null);
      setActiveBranchState(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        activeBranch,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        setActiveBranch,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
