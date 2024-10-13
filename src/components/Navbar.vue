<script setup lang="ts">
import Logout from './Logout.vue';
</script>

<template>
  <nav class="sticky top-0 bg-[#FAFCFB] flex justify-between items-center border-b-4 px-10 py-5">
    <img src="@/assets/icons/Krabs.png" alt="Krabs" width="45" height="45">
    <div class="flex space-x-6">
      <RouterLink to="/overview" class="font-bold rounded-lg px-3 py-2 hover:bg-gray-200">Overview</RouterLink>
      <RouterLink to="/transactions" class="font-bold rounded-lg px-3 py-2 hover:bg-gray-200">Transactions</RouterLink>
      <Logout/>
    </div>
  </nav>
</template>