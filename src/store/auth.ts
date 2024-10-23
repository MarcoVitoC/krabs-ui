import { defineStore } from "pinia"
import axios from "axios"
import router from "@/router"
import { useLocalStorage } from "@vueuse/core"

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      token: useLocalStorage('token', null)
    }
  },
  getters: {
    getToken(state) {
      return state.token
    }
  },
  actions: {
    async register(payload = {}) {
      await axios.post('http://localhost:8080/api/auth/register', payload).then(res => {
        console.log(res) 
        // TODO: 
        // 1. Must validate when the username already exists
        // 2. Must give a succeed message after redirected to Login
        router.push({name: 'Login'})
      }).catch(error => {
        console.error(error)
      })
    },
    async login(payload = {}) {
      const response = await axios.post('http://localhost:8080/api/auth/login', payload);

      if (response.status === 200) {
        const token = response.data.data

        this.token = token
        router.push({name: 'Overview'})
      }
    },
    logout() {
      this.token = null
      router.push({name: 'Login'})
    }
  }
})