import { defineStore } from "pinia"
import type { Expense } from '@/types/Expense';
import type { Category } from '@/types/Category';
import axios from "axios"

const category: Category = {
  id: '',
  icon: '',
  name: ''
}

const selectedExpense: Expense = {
  id: '',
  category: category,
  description: '',
  amount: 0,
  paymentMethod: ''
}

export const useExpenseStore = defineStore('expense', {
  state: () => {
    return {
      expenses: new Map<string, Expense[]>(),
      expense: selectedExpense
    }
  },
  getters: {
    getMonthlyExpenses(state) {
      return state.expenses
    },
    getSelectedExpense(state) {
      return state.expense
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
    async fetchExpense(id: string) {
      await axios.get(`http://localhost:8080/api/expenses/${id}`)
      .then(response => {
        this.expense = response.data.data
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
    },
    async updateExpense(id: string, payload = {}) {
      await axios.put(`http://localhost:8080/api/expenses/${id}`, payload).then(() => {
        this.fetchAllExpenses({
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear()
        })
      }).catch(error => {
        console.error(error)
      })
    },
    async deleteExpense(id: string) {
      await axios.delete(`http://localhost:8080/api/expenses/${id}`)
      .then(() => {
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