import axios from 'axios';
import { useRouter } from 'vue-router';
import { createPinia, setActivePinia } from "pinia"

const pinia = createPinia();
setActivePinia(pinia);

import { useUserStore } from "@/store/user";

const router = useRouter();
const  refreshtokenURL = '/auth/v1/refresh-token';

const userStore = useUserStore();
const { resetCredentials, refreshToken } = userStore;
/*
import { createPinia, setActivePinia } from "pinia"
const pinia = createPinia();
setActivePinia(pinia);
*/

//const userStore = useUserStore();
//const { resetCredentials, refreshToken } = userStore;
//const { resetCredentials, refreshToken } = userStore;
/*

const router = useRouter();
const userStore = useUserStore();
const { resetCredentials, refreshToken } = userStore;
const  refreshtokenURL = '/auth/v1/refresh-token';
*/
let lang = localStorage.getItem('lang') || import.meta.env.VITE_I18N_LOCALE || 'fr';


const defaultOptions = {
  baseURL: import.meta.env.VITE_BASE_URL,
  crossdomain: true,
  //withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': lang,
    'X-localization': lang,
  }
};

let axiosInstance = axios.create(defaultOptions);

/* `axiosInstance` is an instance of the Axios library that is configured with default options. It is
used to make HTTP requests to a server. The default options include the base URL, cross-domain
settings, headers, and interceptors. The interceptors are used to modify the request and response
before they are sent or received. */
axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization =  token ? `Bearer ${token}` : '';
  return config;
});

//  Add a response interceptor
axiosInstance.interceptors.response.use(
  function(response){
    return response;
  },
  async function(error) {
    const originalRequest = error.config;
    if ( error.response.status === 400 ) {
      resetCredentials();
      router.push( { name: 'login'});
      return Promise.reject(error);
    } else if ( error.response.status === 401 && originalRequest.url.includes(refreshtokenURL)) {
      resetCredentials();
      router.push( { name: 'login'});
      router.push("/login");
      return Promise.reject(error);
    } else if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshToken();
      const token = localStorage.getItem('token');
      error.config.headers.Authorization =  `Bearer ${token}`;
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

//
export default axiosInstance;
