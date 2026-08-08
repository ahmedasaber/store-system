import axios from 'axios';
import i18n from '../i18n/config.js';
import { tokenStorage } from '../lib/storage/tokenStorage.js';
import { branchStorage } from '../lib/storage/branchStorage.js';
import { emitUnauthorized } from '../lib/authEvents.js';

export const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Only responsibility: attach contextual headers.
api.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const activeBranchId = branchStorage.getActiveBranchId();
  if (activeBranchId) {
    config.headers['X-Branch-ID'] = activeBranchId;
  }

  config.headers['Accept-Language'] = i18n.language || 'ar';

  return config;
});

// Only reports unauthorized responses. No storage mutation, no navigation —
// that belongs to the auth layer (AuthContext).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      emitUnauthorized();
    }
    return Promise.reject(error);
  },
);

export default api;