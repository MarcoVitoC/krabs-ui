<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { CirclePlus, EllipsisVertical  } from 'lucide-vue-next';
</script>

<template>
  <div class="p-10">
    <header class="flex justify-between">
      <p class="text-2xl font-semibold">📑 Your transactions:</p>
      <div>
        <Button size="sm"><CirclePlus class="w-h h-4"/>Add expense</Button>
      </div>
    </header>
    <div class="my-8">
      <p class="font-medium text-lg mb-3">Wednesday, 17 July 2024</p>
      <div class="flex justify-between items-center bg-primary-foreground border-2 border-navy rounded space-x-10 p-3">
        <p>🍴 Food</p>
        <p>Mc.Donald</p>
        <p>Rp500.000</p>
        <p>Gopay</p>
        <Button size="icon"><EllipsisVertical class="w-h h-4"/></Button>
      </div>
    </div>
  </div>
</template>