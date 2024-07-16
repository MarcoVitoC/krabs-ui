<template>
  <nav class="flex justify-between items-center border-b-4 px-10 py-5">
    <img src="@/assets/icons/Krabs.png" alt="Krabs" width="45" height="45">
    <div class="flex space-x-8">
      <RouterLink to="/" class="font-bold rounded-full px-3 py-2 hover:bg-gray-200">Overview</RouterLink>
      <RouterLink to="/transactions" class="font-bold rounded-full px-3 py-2 hover:bg-gray-200">Transactions</RouterLink>
      <RouterLink to="/categories" class="font-bold rounded-full px-3 py-2 hover:bg-gray-200">Categories</RouterLink>
    </div>
  </nav>
  
</template>