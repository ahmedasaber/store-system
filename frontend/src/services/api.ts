import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('el_ma3ras_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const activeBranchId = localStorage.getItem('el_ma3ras_active_branch');
  if (activeBranchId) {
    config.headers['x-branch-id'] = activeBranchId;
  }

  const lang = localStorage.getItem('i18nextLng') || 'ar';
  config.headers['Accept-Language'] = lang;

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('el_ma3ras_token');
      localStorage.removeItem('el_ma3ras_user');
      // If we are not already on the login page, redirect to /login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
