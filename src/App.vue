<script setup lang="ts">
import Navbar from './components/Navbar.vue'

const isAuthenticated = !!localStorage.getItem('token')
</script>

<template>
  <Navbar v-if="isAuthenticated"/>
  <RouterView />
</template>
