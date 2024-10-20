<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore()

const isModalOpen = ref<boolean>(false)

const toggleLogout = async () => {
  isModalOpen.value = !isModalOpen.value
}

const logout= () => {
  toggleLogout()
  authStore.logout()
}
</script>

<template>
  <Dialog v-model:open="isModalOpen">
    <Button @click="toggleLogout">Logout</Button>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure want to logout?</DialogTitle>
      </DialogHeader>
      
      <DialogFooter>
        <Button @click="toggleLogout">Cancel</Button>
        <Button @click="logout">Yes</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>