import axios from 'axios';
import router from '@/router';

const refreshtokenURL = '/ipms/api/auth/v1/refresh-token';

let lang = localStorage.getItem('lang') || import.meta.env.VITE_I18N_LOCALE || 'fr';

const defaultOptions = {
  baseURL: import.meta.env.VITE_BASE_URL,
  crossdomain: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': lang,
    'X-localization': lang,
  }
};

let axiosInstance = axios.create(defaultOptions);

axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    // Import du store en lazy pour éviter la dépendance circulaire
    const { useUserStore } = await import('@/store/user');
    const userStore = useUserStore();

    const originalRequest = error.config;

    if (error.response.status === 400) {
      userStore.resetCredentials();
      router.push({ name: 'home' });
      return Promise.reject(error);
    }

    if (error.response.status === 401 && originalRequest.url.includes(refreshtokenURL)) {
      userStore.resetCredentials();
      router.push({ name: 'home' });
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await userStore.refreshAccessToken();
        const token = localStorage.getItem('token');
        error.config.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        userStore.resetCredentials();
        router.push({ name: 'home' });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
