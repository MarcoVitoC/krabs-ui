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
import { useToast, Toaster } from '@/components/ui/toast'
import { CirclePlus } from 'lucide-vue-next'
import { ref } from 'vue';
import { useExpenseStore } from '@/store/expense'
import { useCategoryStore } from '@/store/category'

const { toast } = useToast()

const category = useCategoryStore()
const expense = useExpenseStore()

category.fetchAllCategories()

const categoryId = ref<string>('')
const description = ref<string>('')
const amount = ref<number>()
const paymentMethod = ref<string>('')
const handleAddExpense = () => {
  const newExpense = {
    categoryId: categoryId.value,
    description: description.value,
    amount: amount.value,
    paymentMethod: paymentMethod.value
  }

  expense.saveExpense(newExpense)
  toast({
    title: '✅ Success',
    description: 'New Expense Added Successfully!'
  });
  clearForm()
}

const clearForm = () => {
  categoryId.value = ''
  description.value = ''
  amount.value = undefined
  paymentMethod.value = ''
}
</script>

<template>
  <Toaster/>

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
      
      <Select v-model="categoryId">
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="category in category.getAllCategories" :key="category.id" :value="category.id">
            {{ category.icon }} {{ category.name }}
          </SelectItem>
        </SelectContent>
      </Select>
      <Input v-model="description" placeholder="Description" />
      <Input v-model="amount" type="number" placeholder="Amount" />
      <Select v-model="paymentMethod">
        <SelectTrigger>
          <SelectValue placeholder="Select payment method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Cash">Cash</SelectItem>
          <SelectItem value="BCA">BCA</SelectItem>
          <SelectItem value="Gopay">Gopay</SelectItem>
          <SelectItem value="OVO">OVO</SelectItem>
        </SelectContent>
      </Select>

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