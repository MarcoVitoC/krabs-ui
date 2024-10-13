import { defineStore } from "pinia"
import type { Category } from '@/types/Category';
import { useAuthStore } from '@/store/auth';
import axios from "axios"

export const useCategoryStore = defineStore('category', {
  state: () => {
    return {
      categories: <Category[]>([])
    }
  },
  getters: {
    getAllCategories(state) {
      return state.categories
    },
    getAuthToken() {
      const authStore = useAuthStore()
      return authStore.getToken
    }
  },
  actions: {
    async fetchAllCategories() {
      await axios.get('http://localhost:8080/api/categories', {
        headers: {
          Authorization: `Bearer ${this.getAuthToken}`
        }
      }).then(response => {
        this.categories = response.data.data
      }).catch(error => {
        console.error(error);
      })
    }
  }
})