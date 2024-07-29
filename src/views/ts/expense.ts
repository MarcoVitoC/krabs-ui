import { ref, onMounted } from 'vue';
import type { Expense } from '@/types/Expense';
import axios from "axios"

export function getAllExpenses(params = {}) {
  const expenses = ref<Map<string, Expense[]>>(new Map())

  onMounted(async () => {
    await axios.get('http://localhost:8080/api/expenses', { params }).then(response => {
      expenses.value = response.data.data
    }).catch(error => {
      console.error(error);
    })
  })

  return expenses
}

export function saveExpense(payload = {}) {
  axios.post('http://localhost:8080/api/expenses', payload).then(response => {
    return response.data;
  }).catch(error => {
    console.error(error);
  })
}