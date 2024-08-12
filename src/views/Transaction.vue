<script setup lang="ts">
import { onMounted, computed } from 'vue';
import AddExpense from '@/components/AddExpense.vue'
import EditOrDelete from '@/components/EditOrDelete.vue';
import { formatDate } from '@vueuse/core';
import { useExpenseStore } from '@/store/expense'

const expenseStore = useExpenseStore()

onMounted(() => {
  expenseStore.fetchAllExpenses({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
})

const monthlyExpenses = computed(() => {
  return expenseStore.getMonthlyExpenses
})

const isEmpty = (expenses: Array<Object>): boolean => {
  return expenses.length === 0;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount);
}

const iconBackgroundColor:Record<string, string> = {
  'Food & Drink': '#FFEBCC',
  'Transport': '#F0F8FF',
  'Lifestyle': '#FFE4B5',
  'Investment': '#D4EDDA',
  'Shopping': '#FFC0CB',
  'Groceries': '#DFF0D8',
  'Other': '#F5F5F5'
}
</script>

<template>
  <div class="p-10">
    <header class="flex justify-between">
      <p class="text-2xl font-semibold">📑 Your transactions:</p>
      <AddExpense />
    </header>
    <div v-for="[date, expenses] in Object.entries(monthlyExpenses)" :key="date">
      <div class="my-8" v-if="!isEmpty(expenses)">
        <p class="font-medium text-lg mb-3">{{ formatDate(new Date(date), "dddd, DD MMMM YYYY") }}</p>
        <div class="flex justify-between items-center bg-primary-foreground border-2 border-navy rounded space-x-10 p-3" v-for="expense in expenses" :key="expense.id">
          <p class="w-36 p-3 rounded-lg" :style="{backgroundColor: iconBackgroundColor[expense.category.name]}">
            {{ expense.category.icon }} {{ expense.category.name }}
          </p>
          <p class="flex-1">{{ expense.description }}</p>
          <p class="flex-1">{{ formatCurrency(expense.amount) }}</p>
          <p class="flex-1">{{ expense.paymentMethod }}</p>
          
          <EditOrDelete :expenseId="expense.id" />
        </div>
      </div>
    </div>
  </div>
</template>