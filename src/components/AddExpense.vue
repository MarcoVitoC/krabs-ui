<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose, 
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { CirclePlus } from 'lucide-vue-next';
import { getAllCategories } from '@/views/ts/category';
import { saveExpense } from '@/views/ts/expense';
import { ref } from 'vue';

const categories = getAllCategories();

const category = ref<string>('')
const description = ref<string>('')
const amount = ref<number>()
const paymentMethod = ref<string>('')
const handleAddExpense = () => {
  const newExpense = {
    categoryId: category.value,
    description: description.value,
    amount: amount.value,
    paymentMethod: paymentMethod.value
  }

  saveExpense(newExpense);
}
</script>

<template>
  <Dialog>
    <DialogTrigger>
      <Button size="sm">
        <CirclePlus class="h-4"/>Add expense
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add expense</DialogTitle>
      </DialogHeader>
      
      <Select v-model="category">
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.icon }} {{ category.name }}
          </SelectItem>
        </SelectContent>
      </Select>
      <Input v-model="description" placeholder="Description" />
      <Input v-model="amount" type="number" placeholder="Amount" />
      <Input v-model="paymentMethod" placeholder="Payment Method" />

      <DialogFooter>
        <DialogClose>
          <Button type="submit" @click="handleAddExpense()">
            Save
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>