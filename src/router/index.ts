import { createRouter, createWebHistory } from 'vue-router'
import Register from '@/views/auth/Register.vue'
import Login from '@/views/auth/Login.vue'
import Overview from '@/views/Overview.vue'
import Transaction from '@/views/Transaction.vue'
import { useAuthStore } from '@/store/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'bg-gray-200',
  routes: [
    {
      name: 'Register',
      path: '/register',
      component: Register
    },
    {
      name: 'Login',
      path: '/login',
      component: Login
    },
    {
      name: 'Overview',
      path: '/overview',
      component: Overview
    },
    {
      name: 'Transactions',
      path: '/transactions',
      component: Transaction
    }
  ]
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.getToken

  if (!isAuthenticated && to.name !== 'Login' && to.name !== 'Register') return { name: 'Login' }
  if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) return router.back()
})

export default router
