import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
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
    }
    return Promise.reject(error);
  },
);

export default api;
