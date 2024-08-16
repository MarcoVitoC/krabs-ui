<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useForm } from 'vee-validate'
import { useToast } from '@/components/ui/toast'
import { CirclePlus } from 'lucide-vue-next'
import { ref, computed } from 'vue';
import { useExpenseStore } from '@/store/expense'
import { useCategoryStore } from '@/store/category'
import type { Category } from '@/types/Category'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const { toast } = useToast()

const categoryStore = useCategoryStore()
const expenseStore = useExpenseStore()

const isModalOpen = ref<boolean>(false)
const categories = computed<Category[]>(() => categoryStore.getAllCategories)

const getAllCategories = async () => {
  isModalOpen.value = true
  await categoryStore.fetchAllCategories()
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

const handleAddExpense = async (newExpense: Object) => {
  await expenseStore.saveExpense(newExpense)
  showSuccessToast('New Expense Added Successfully!');
}

const showSuccessToast = (message: string) => {
  toast({
    title: '✅ Success',
    description: message
  });
}

const onSubmit = form.handleSubmit((newExpense) => {
  handleAddExpense(newExpense)
  isModalOpen.value = false
})
</script>

<template>
  <Dialog v-model:open="isModalOpen">
    <Button size="sm" @click="getAllCategories">
      <CirclePlus class="h-4"/>Add expense
    </Button>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add expense</DialogTitle>
      </DialogHeader>
      
      <form id="addExpenseForm" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="categoryId">
          <FormItem class="pb-3">
            <Select v-bind="componentField">
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
              <Input placeholder="Description" v-bind="componentField" />
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="amount">
          <FormItem class="pb-3">
            <FormControl>
              <Input type="text" inputmode="numeric" placeholder="Amount" v-bind="componentField" />
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="paymentMethod">
          <FormItem class="pb-3">
            <FormControl>
              <Select v-bind="componentField">
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
        <Button type="submit" form="addExpenseForm">
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>