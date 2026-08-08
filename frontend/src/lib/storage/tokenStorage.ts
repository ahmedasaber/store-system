export interface TokenStorage {
    getToken(): string | null;
    setToken(token: string): void;
    clearToken(): void;
  }
  
  const TOKEN_KEY = 'el_ma3ras_token';
  
  class LocalStorageTokenStorage implements TokenStorage {
    getToken(): string | null {
      return localStorage.getItem(TOKEN_KEY);
    }
    setToken(token: string): void {
      localStorage.setItem(TOKEN_KEY, token);
    }
    clearToken(): void {
      localStorage.removeItem(TOKEN_KEY);
    }
  }
  
  // Swap this implementation (e.g. HTTP-only cookies) without touching
  // AuthContext or any other consumer.
  export const tokenStorage: TokenStorage = new LocalStorageTokenStorage();