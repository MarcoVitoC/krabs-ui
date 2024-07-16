import { createRouter, createWebHistory } from 'vue-router'
import Overview from '@/views/Overview.vue'
import Transaction from '@/views/Transaction.vue'
import Category from '@/views/Category.vue'

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
    },
    {
      path: '/categories',
      component: Category
    }
  ]
})

export default router
