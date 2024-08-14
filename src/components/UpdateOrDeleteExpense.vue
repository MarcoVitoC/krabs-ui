<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose, 
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
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
import { EllipsisVertical, SquarePen, Trash2 } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { computed, ref } from 'vue';
import { useExpenseStore } from '@/store/expense'
import { useCategoryStore } from '@/store/category'
import type { Expense } from '@/types/Expense'
import type { Category } from '@/types/Category'

const props = defineProps<{ expenseId: string }>()

const { toast } = useToast()

const categoryStore = useCategoryStore()
const expenseStore = useExpenseStore()

const categoryId = ref<string>('')
const description = ref<string>('')
const amount = ref<number>()
const paymentMethod = ref<string>('')
const isModalOpen = ref<boolean>(false)
const modalOperation = ref<string>('')

const categories = computed<Category[]>(() => categoryStore.getAllCategories)
const selectedExpense = computed<Expense>(() => expenseStore.getSelectedExpense)
const isDisabled = computed<boolean>(() => modalOperation.value === 'isDelete')

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

const handleOpenModal = (operation: string) => {
  isModalOpen.value = true
  modalOperation.value = operation
  fetchExpenseData()
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

const handleDeleteExpense = () => {
  expenseStore.deleteExpense(props.expenseId)
  
  toast({
    title: '✅ Success',
    description: 'Expense Deleted Successfully!'
  });
}
</script>

<template>
  <Toaster/>

  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button size="icon">
        <EllipsisVertical class="h-4"/>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-20">
      <DropdownMenuItem @click="handleOpenModal('isUpdate')">
        <SquarePen class="mr-2 h-4 w-4" />
        <span>Update</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleOpenModal('isDelete')">
        <Trash2 class="mr-2 h-4 w-4" />
        <span>Delete</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Dialog v-model:open="isModalOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle v-if="modalOperation === 'isUpdate'">Edit expense</DialogTitle>
        <DialogTitle v-else>Are you sure want to delete this expense?</DialogTitle>
      </DialogHeader>
      
      <Select v-model="categoryId" :disabled="isDisabled">
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.icon }} {{ category.name }}
          </SelectItem>
        </SelectContent>
      </Select>
      <Input v-model="description" :disabled="isDisabled" placeholder="Description" />
      <Input v-model="amount" :disabled="isDisabled" type="text" inputmode="numeric" placeholder="Amount" />
      <Select v-model="paymentMethod" :disabled="isDisabled">
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
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </DialogClose>
        <DialogClose>
          <Button v-if="modalOperation === 'isUpdate'" type="submit" @click="handleUpdateExpense()">
            Update
          </Button>
          <Button v-else type="submit" @click="handleDeleteExpense()">
            Delete
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>