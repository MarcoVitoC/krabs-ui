<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore()

const isModalOpen = ref<boolean>(false)

const openConfirmation = async () => {
  isModalOpen.value = true
}

const logout= () => {
  isModalOpen.value = false
  authStore.logout()
}
</script>

<template>
  <Dialog v-model:open="isModalOpen">
    <Button @click="openConfirmation">Logout</Button>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure want to logout?</DialogTitle>
      </DialogHeader>
      
      <DialogFooter>
        <Button>Cancel</Button>
        <Button @click="logout">Yes</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>