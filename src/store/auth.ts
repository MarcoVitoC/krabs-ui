import { defineStore } from "pinia"
import axios from "axios"
import router from "@/router"
import { useLocalStorage } from "@vueuse/core"

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      token: useLocalStorage('token', null),
      username: useLocalStorage('username', ''),
      message: {
        text: '',
        type: ''
      }
    }
  },
  getters: {
    getToken(state) {
      return state.token
    },
    getMessage(state) {
      return state.message
    },
    getUsername(state) {
      return state.username
    }
  },
  actions: {
    async register(payload = {}) {
      await axios.post('http://localhost:8080/api/auth/register', payload).then(response => {
        const { code, error } = response.data

        if (code === 200) {
          this.message = {
            text: 'Registration Succeed. Please Login!',
            type: 'SUCCESS'
          }
          router.push({name: 'Login'})
        } else {
          this.message = {
            text: error.USERNAME_ALREADY_EXIST,
            type: 'REGISTER'
          }
        }
      }).catch(error => {
        console.error(error)
      })
    },
    async login(payload = {}) {
      const response = await axios.post('http://localhost:8080/api/auth/login', payload);
      const { code, data, error } = response.data

      if (code === 200) {
        this.token = data
        this.fetchUsername()
        
        router.push({name: 'Overview'})
      } else {
        this.message = {
          text: error.INVALID_CREDENTIALS,
          type: 'LOGIN'
        }
      }
    },
    async fetchUsername() {
      await axios.get('http://localhost:8080/api/auth/username', {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(response => {
        this.username = response.data.data
      }).catch(error => {
        console.error(error)
      })
    },
    logout() {
      this.token = null
      this.username = ''
      this.message = {
        text: '',
        type: ''
      }
      
      router.push({name: 'Login'})
    }
  }
})