import { defineStore } from 'pinia'
import axios from '@/plugins/axios.js'

const  loginURL = '/ipms/api/auth/v1/connexion';
const  lougoutURL = '/ipms/api/auth/v1/deconnexion';
const  refreshtokenURL = '/ipms/api/auth/v1/refresh-token';

export const useUserStore = defineStore('user', {

  state: () => ({
    isLoggedIn: false,
    refreshToken:'',
    username:'',
    users: [],
    user: {
      username: '',
      fullname: '',
      photo: '',
      initiale: ''
    },
    loading: false,
    error: null
  }),

  getters: {
    getLoggedIn: (state) => state.isLoggedIn,
    getUser: (state) => state.user,
    getRefreshToken: (state) => state.refreshToken,
    getUsername: (state) => state.username,
  },

  actions: {
    //  connexion
    async login(payload){
      this.user = null;
      this.loading = true;
      console.log(payload);
      try {
        //`${loginURL}`
        await axios.post(loginURL, payload)
        .then((response) => {
          if(response.status === 200 && response.data.authenticationToken){
            localStorage.setItem('token', response.data.authenticationToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('username', response.data.username);
            this.user = {
              username: response.data.username,
              fullname: response.data.fullname,
              photo: response.data.photo,
              initiale: response.data.initiale
            };
            console.log(this.user);
            this.changeLoggedIn(true);
            this.refreshToken = response.data.refreshToken;
            this.username = response.data.username;
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.authenticationToken}`;
          }
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },
    //
    async logout(){
      //this.user = null;
      this.loading = true;
      const payload = {
        refreshToken: this.refreshToken,
        username: this.username
      };
      console.log(payload);
      try {
        await axios.post(lougoutURL, payload).then((response) => {
          if(response.status === 200){
            /*this.changeLoggedIn(false);
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('username');
            localStorage.removeItem('token');
            this.user = null;*/
            this.resetCredentials();
          }
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },
    //
    async refreshToken(){
      //this.user = null;
      this.loading = true;
      const payload = {
        refreshToken: this.refreshToken,
        username: this.username
      };
      console.log(payload);
      try {
        await axios.post(refreshtokenURL, payload).then((response) => {
          if(response.status === 200 && response.data.authenticationToken){
            localStorage.setItem('token', response.data.authenticationToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('username', response.data.username);
            this.user = {
              username: response.data.username,
              fullname: response.data.fullname,
              photo: response.data.photo,
              initiale: response.data.initiale
            };
            this.changeLoggedIn(true);
            this.refreshToken = response.data.refreshToken;
            this.username = response.data.username;
          }
        })
      } catch (error) {
        console.log(error);
        this.error = error
      } finally {
        this.loading = false
      }
    },
    //
    changeLoggedIn() {
      if(localStorage.getItem('token')){
        this.isLoggedIn = true;
      } else{
        this.isLoggedIn = false;
      }
    },
    //  reset credentials
    resetCredentials() {
      this.changeLoggedIn(false);
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      this.user = null;
      this.refreshToken = "";
      this.username = "";
    }
  }
})

