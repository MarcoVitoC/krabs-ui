import { defineStore } from "pinia"
import axios from "axios"
import router from "@/router"

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      token: localStorage.getItem('token') || null
    }
  },
  getters: {
    getToken(state) {
      return state.token
    }
  },
  actions: {
    async register(payload = {}) {
      await axios.post('http://localhost:8080/api/auth/register', payload).then(() => {
        router.push({name: 'Login'})
      }).catch(error => {
        console.error(error)
      })
    },
    async login(payload = {}) {
      const response = await axios.post('http://localhost:8080/api/auth/login', payload);

      if (response.status === 200) {
        const token = response.data.data

        localStorage.setItem('token', token)
        this.token = token
        router.push({name: 'Overview'})
      }
    },
    logout() {
      localStorage.removeItem('token')
      router.push({name: 'Login'})
    }
  }
})