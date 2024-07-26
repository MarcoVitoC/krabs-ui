import { createRouter, createWebHistory } from 'vue-router'
import Overview from '@/views/Overview.vue'
import Transaction from '@/views/Transaction.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'bg-gray-200',
  routes: [
    {
      path: '/',
      component: Overview
    },
    {
      path: '/transactions',
      component: Transaction
    }
  ]
})

export default router
