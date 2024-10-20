<script setup lang="ts">
import { computed } from 'vue';
import Navbar from './components/Navbar.vue'
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore()
const isAuthenticated = computed(() => !!authStore.getToken)
</script>

<template>
  <Navbar v-if="isAuthenticated"/>
  <RouterView />
</template>
