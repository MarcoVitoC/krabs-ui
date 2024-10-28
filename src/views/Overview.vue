<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue';
import { formatDate } from '@vueuse/core';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AreaChart } from '@/components/ui/chart-area'
import { useExpenseStore } from '@/store/expense'
import { useAuthStore } from '@/store/auth';
import type { Expense } from '@/types/Expense';

const expenseStore = useExpenseStore()
const authStore = useAuthStore()

const monthNames = [
  'January', 
  'February', 
  'March', 
  'April', 
  'May', 
  'June', 
  'July', 
  'August', 
  'September', 
  'October', 
  'November', 
  'December'
]
const selectedMonth = ref<string>((new Date().getMonth() + 1).toString())
const selectedMonthName = ref<string>(monthNames[parseInt(selectedMonth.value) - 1])
const username = computed<string>(() => authStore.getUsername || '')

onMounted(() => {
  fetchExpenses()
})

watch(selectedMonth, () => {
  selectedMonthName.value = monthNames[parseInt(selectedMonth.value) - 1]
  fetchExpenses()
})

const fetchExpenses = async () => {
  await expenseStore.fetchAllExpenses({
    month: parseInt(selectedMonth.value),
    year: new Date().getFullYear()
  });
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount);
}

const totalExpense = computed(() => {
  let total = 0

  Object.values(expenseStore.getMonthlyExpenses).forEach(expenses => {
    expenses.forEach((expense: Expense) => {
      total += expense.amount
    })
  })

  return formatCurrency(total)
})

const weeklyExpenses = computed(() => {
  const weeklyExpensesMap: Record<string, number> = {}

  Object.entries(expenseStore.getMonthlyExpenses)
    .sort()
    .forEach(([date, expenses]) => {
      expenses.forEach((expense: Expense) => {
        if (!weeklyExpensesMap[date]) weeklyExpensesMap[date] = 0
        weeklyExpensesMap[date] += expense.amount
      })
  })

  return weeklyExpensesMap
})

const expenseChartData = computed(() => {
  return Object.keys(weeklyExpenses.value).map(date => ({
    date: formatDate(new Date(date), "DD MMMM YYYY"),
    total: weeklyExpenses.value[date]
  }))
})
</script>

<template>
  <div class="p-10">
    <header>
      <p class="flex gap-2 text-2xl font-semibold">
        Welcome back {{ username }} 👋, your total expense in 
        <Select v-model="selectedMonth">
          <SelectTrigger class="w-32">
            <SelectValue :placeholder="selectedMonthName" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="(month, index) in monthNames" :key="index" :value="(index + 1).toString()">
              {{ month }}
            </SelectItem>
          </SelectContent>
        </Select>
          is {{ totalExpense }}
      </p>
    </header>
    <AreaChart 
      class="mt-5 p-5 w-[900px] h-[450px] border-2 border-navy rounded" 
      index="date" 
      :data="expenseChartData" 
      :categories="['total']"
      :colors="['#001F3F']"
      :show-legend="false"
    />
  </div>
</template>