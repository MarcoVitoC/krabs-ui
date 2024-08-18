<script setup lang="ts">
import { useToast, Toaster } from '@/components/ui/toast'
import { EllipsisVertical, SquarePen, Trash2 } from 'lucide-vue-next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { computed, ref } from 'vue';
import { useExpenseStore } from '@/store/expense'
import { useCategoryStore } from '@/store/category'
import type { Expense } from '@/types/Expense'
import type { Category } from '@/types/Category'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const props = defineProps<{ expenseId: string }>()

const { toast } = useToast()

const categoryStore = useCategoryStore()
const expenseStore = useExpenseStore()

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

  form.setValues({
    categoryId: category.id,
    description: newDescription,
    amount: newAmount.toString(),
    paymentMethod: newPaymentMethod
  })
}

const handleOpenModal = async (operation: string) => {
  await fetchExpenseData()
  modalOperation.value = operation
  isModalOpen.value = true
}

const handleUpdateExpense = (newExpense: Object) => {
  expenseStore.updateExpense(props.expenseId, newExpense)
  // showSuccessToast('Expense Updated Successfully!')
}

const handleDeleteExpense = () => {
  expenseStore.deleteExpense(props.expenseId)
  isModalOpen.value = false
  // showSuccessToast('Expense Deleted Successfully!')
}

const showSuccessToast = (message: string) => {
  toast({
    title: '✅ Success',
    description: message
  });
}

const formSchema = toTypedSchema(z.object({
  categoryId: z.string({required_error: 'Please select a category!'}),
  description: z.string({required_error: 'Description field cannot be empty!'})
    .min(1, 'This field cannot be empty!'),
  amount: z.string({required_error: 'Amount field cannot be empty!'})
    .min(1, 'This field cannot be empty!')
    .refine(value => !isNaN(Number(value)), { message: 'Amount should be numeric!' }),
  paymentMethod: z.string({required_error: 'Please select your payment method!'}),
}))

const form = useForm({
  validationSchema: formSchema
})

const onSubmit = form.handleSubmit((newExpense) => {
  handleUpdateExpense(newExpense)
  isModalOpen.value = false
})
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

      <form id="updateExpenseForm" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="categoryId">
          <FormItem class="pb-3">
            <Select v-bind="componentField" :disabled="isDisabled">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.icon }} {{ category.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage/>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem class="pb-3">
            <FormControl>
              <Input placeholder="Description" v-bind="componentField" :disabled="isDisabled" />
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="amount">
          <FormItem class="pb-3">
            <FormControl>
              <Input type="text" inputmode="numeric" placeholder="Amount" v-bind="componentField" :disabled="isDisabled" />
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="paymentMethod">
          <FormItem class="pb-3">
            <FormControl>
              <Select v-bind="componentField" :disabled="isDisabled">
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
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>
      </form>

      <DialogFooter>
        <DialogClose>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </DialogClose>
        <Button v-if="modalOperation === 'isUpdate'" type="submit" form="updateExpenseForm">
          Save
        </Button>
        <Button v-else type="submit" @click="handleDeleteExpense()">
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>