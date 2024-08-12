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
import { EllipsisVertical  } from 'lucide-vue-next'
import { computed, ref } from 'vue';
import { useExpenseStore } from '@/store/expense'
import { useCategoryStore } from '@/store/category'
import type { Expense } from '@/types/Expense';
import type { Category } from '@/types/Category';

const { toast } = useToast()

const props = defineProps<{ expenseId: string }>();

const categoryStore = useCategoryStore()
const expenseStore = useExpenseStore()

const categoryId = ref<string>('')
const description = ref<string>('')
const amount = ref<number>()
const paymentMethod = ref<string>('')

const categories = computed<Category[]>(() => categoryStore.getAllCategories)
const selectedExpense = computed<Expense>(() => expenseStore.getSelectedExpense)

const fetchExpenseData = async () => {
  await Promise.all([
    categoryStore.fetchAllCategories(),
    expenseStore.fetchExpense(props.expenseId)
  ])

  const { 
    category, 
    description: newDescription, 
    amount: newAmount, 
    paymentMethod: newPaymentMethod 
  } = selectedExpense.value

  categoryId.value = category.id
  description.value = newDescription
  amount.value = newAmount
  paymentMethod.value = newPaymentMethod
}

const handleUpdateExpense = () => {
  const newExpense = {
    categoryId: categoryId.value,
    description: description.value,
    amount: amount.value,
    paymentMethod: paymentMethod.value
  }

  expenseStore.saveExpense(newExpense)
  toast({
    title: '✅ Success',
    description: 'Expense Updated Successfully!'
  });
  clearForm()
}

const clearForm = () => {
  categoryId.value = ''
  description.value = ''
  amount.value = 0
  paymentMethod.value = ''
}
</script>

<template>
  <Toaster/>

  <Dialog>
    <DialogTrigger>
      <Button size="icon" @click="fetchExpenseData">
        <EllipsisVertical class="h-4"/>
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit expense</DialogTitle>
      </DialogHeader>
      
      <Select v-model="categoryId">
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
      <Input v-model="amount" type="text" inputmode="numeric" placeholder="Amount" />
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
          <Button type="submit" @click="handleUpdateExpense()">
            Save
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>