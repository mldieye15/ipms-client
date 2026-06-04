import { defineStore } from 'pinia'
import axios from '@/plugins/axios.js'

const loginURL = '/ipms/api/auth/v1/connexion';
const lougoutURL = '/ipms/api/auth/v1/deconnexion';
const refreshtokenURL = '/ipms/api/auth/v1/refresh-token';
const sendResetPwdURL = '/ipms/api/auth/v1/forgot-password';
const resetPwdURL = '/ipms/api/auth/v1/reset-password';

const USER_STORAGE_KEY = 'user_data';

function saveUserToStorage(userData) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
}

function loadUserFromStorage() {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearUserFromStorage() {
  localStorage.removeItem(USER_STORAGE_KEY);
}

export const useUserStore = defineStore('user', {

  state: () => ({
    isLoggedIn: false,
    refreshTokenValue: '',
    username: '',
    users: [],
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    getLoggedIn: (state) => state.isLoggedIn,
    getUser: (state) => state.user,
    getRefreshToken: (state) => state.refreshTokenValue,
    getUsername: (state) => state.username,
    getError: (state) => state.error,
  },

  actions: {
    async login(payload) {
      this.user = null;
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post(loginURL, payload);
        if (response.status === 200 && response.data.authenticationToken) {
          const userData = {
            username: response.data.username,
            fullname: response.data.fullname,
            photo: response.data.photo,
            initiale: response.data.initiale
          };
          localStorage.setItem('token', response.data.authenticationToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('username', response.data.username);
          saveUserToStorage(userData);

          this.user = userData;
          this.error = false;
          this.isLoggedIn = true;
          this.refreshTokenValue = response.data.refreshToken;
          this.username = response.data.username;
        }
      } catch (error) {
        console.log(error);
        this.error = true;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;
      const refreshTokenLocal = localStorage.getItem('refreshToken');
      const usernameLocal = localStorage.getItem('username');
      const payload = {
        refreshToken: refreshTokenLocal,
        username: usernameLocal
      };
      try {
        await axios.post(lougoutURL, payload);
      } catch (error) {
        console.log(error);
      } finally {
        this.resetCredentials();
        this.loading = false;
      }
    },

    async refreshAccessToken() {
      const refreshTokenLocal = localStorage.getItem('refreshToken');
      const usernameLocal = localStorage.getItem('username');
      if (!refreshTokenLocal || !usernameLocal) throw new Error('No refresh token');

      const payload = {
        refreshToken: refreshTokenLocal,
        username: usernameLocal
      };

      const response = await axios.post(refreshtokenURL, payload);
      if (response.status === 200 && response.data.authenticationToken) {
        const userData = {
          username: response.data.username,
          fullname: response.data.fullname,
          photo: response.data.photo,
          initiale: response.data.initiale
        };
        localStorage.setItem('token', response.data.authenticationToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('username', response.data.username);
        saveUserToStorage(userData);

        this.user = userData;
        this.isLoggedIn = true;
        this.refreshTokenValue = response.data.refreshToken;
        this.username = response.data.username;
      }
    },

    // Restaure la session depuis localStorage (appelé au montage de l'app)
    changeLoggedIn() {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn = true;
        const savedUser = loadUserFromStorage();
        if (savedUser) {
          this.user = savedUser;
          this.username = savedUser.username || '';
        }
      } else {
        this.isLoggedIn = false;
        this.user = null;
        this.username = '';
      }
    },

    async sendResetpwdMail(payload) {
      this.loading = true;
      this.error = null;
      try {
        await axios.post(sendResetPwdURL, payload);
      } catch (error) {
        console.log(error);
        this.error = true;
      } finally {
        this.loading = false;
      }
    },

    async resetPwd(payload) {
      this.loading = true;
      this.error = null;
      try {
        await axios.post(resetPwdURL, payload);
      } catch (error) {
        console.log(error);
        this.error = true;
      } finally {
        this.loading = false;
      }
    },

    resetCredentials() {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
      clearUserFromStorage();
      this.isLoggedIn = false;
      this.user = null;
      this.refreshTokenValue = '';
      this.username = '';
    }
  }
})
