import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import authService, { UserAuthProfile, AssignedBranchInfo, LoginCredentials } from '../services/authService.js';
import { tokenStorage } from '../lib/storage/tokenStorage.js';
import { branchStorage } from '../lib/storage/branchStorage.js';
import { onUnauthorized } from '../lib/authEvents.js';

interface AuthContextType {
  user: UserAuthProfile | null;
  token: string | null;
  /** Persisted source of truth for branch selection. */
  activeBranchId: string | null;
  /** Convenience lookup derived from user.assignedBranches + activeBranchId. Not itself persisted. */
  activeBranch: AssignedBranchInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  setActiveBranchId: (branchId: string) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAuthProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => tokenStorage.getToken());
  const [activeBranchId, setActiveBranchIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const activeBranch = useMemo<AssignedBranchInfo | null>(() => {
    if (!user || !activeBranchId) return null;
    return user.assignedBranches?.find((b) => b.id === activeBranchId) ?? null;
  }, [user, activeBranchId]);

  const syncActiveBranchId = useCallback((userData: UserAuthProfile) => {
    const savedBranchId = branchStorage.getActiveBranchId();
    const branches = userData.assignedBranches || [];

    if (savedBranchId && branches.some((b) => b.id === savedBranchId)) {
      setActiveBranchIdState(savedBranchId);
    } else if (branches.length > 0) {
      setActiveBranchIdState(branches[0].id);
      branchStorage.setActiveBranchId(branches[0].id);
    } else {
      setActiveBranchIdState(null);
      branchStorage.clearActiveBranchId();
    }
  }, []);

  const setActiveBranchId = useCallback((branchId: string) => {
    setActiveBranchIdState(branchId);
    branchStorage.setActiveBranchId(branchId);
  }, []);

  const clearSession = useCallback(() => {
    tokenStorage.clearToken();
    branchStorage.clearActiveBranchId();
    setUser(null);
    setToken(null);
    setActiveBranchIdState(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const existingToken = tokenStorage.getToken();
    if (!existingToken) {
      clearSession();
      setIsLoading(false);
      return;
    }
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setToken(existingToken);
      syncActiveBranchId(userData);
    } catch {
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, [clearSession, syncActiveBranchId]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // 401s are reported by Axios but handled here — the auth layer decides.
  useEffect(() => onUnauthorized(() => clearSession()), [clearSession]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      tokenStorage.setToken(data.accessToken);
      setToken(data.accessToken);
      setUser(data.user);
      syncActiveBranchId(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      clearSession();
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user, token, activeBranchId, activeBranch, isLoading,
        isAuthenticated: !!user && !!token,
        login, logout, setActiveBranchId, refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;