import { defineStore } from "pinia"
import type { Expense } from '@/types/Expense';
import axios from "axios"

export const useExpenseStore = defineStore('expense', {
  state: () => {
    return {
      expenses: new Map<string, Expense[]>()
    }
  },
  getters: {
    getMonthlyExpenses(state) {
      return state.expenses
    }
  },
  actions: {
    async fetchAllExpenses(params = {}) {
      await axios.get('http://localhost:8080/api/expenses', { params })
      .then(response => {
        this.expenses = response.data.data
      }).catch(error => {
        console.error(error)
      })
    },
    async saveExpense(payload = {}) {
      await axios.post('http://localhost:8080/api/expenses', payload).then(() => {
        this.fetchAllExpenses({
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear()
        })
      }).catch(error => {
        console.error(error)
      })
    }
  }
})