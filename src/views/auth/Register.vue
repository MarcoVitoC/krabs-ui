<script setup lang="ts">
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/store/auth';
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'

const authStore = useAuthStore()

const message = computed(() => authStore.getMessage)
const text = computed(() => message.value.text)
const type = computed(() => message.value.type)
const isError = computed(() => text.value !== '' && type.value === 'REGISTER')

const formSchema = toTypedSchema(z.object({
  username: z.string({required_error: 'Username field cannot be empty!'})
    .min(1, 'This field cannot be empty!'),
  password: z.string({required_error: 'Password field cannot be empty!'})
    .min(1, 'This field cannot be empty!')
}))

const form = useForm({
  validationSchema: formSchema
})

const onSubmit = form.handleSubmit(async (newUser) => {
  await authStore.register(newUser)
})
</script>

<template>
  <div class="flex flex-1 flex-col py-40">
    <h1 class="font-bold text-2xl mx-auto">Register</h1>
    <div class="mt-10 mx-auto p-7 bg-primary-foreground border-2 border-navy rounded">
      <form id="registerForm" @submit="onSubmit">
        <div v-if="isError" class="border border-primary text-primary flex items-center gap-2 mb-3 p-2 rounded">
          <AlertCircle class="w-4 h-4" />
          <h1>{{ text }}</h1>
        </div>
        <FormField v-slot="{ componentField }" name="username">
          <FormItem class="pb-3">
            <FormControl>
              <Input placeholder="Username" v-bind="componentField" />
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem class="pb-3">
            <FormControl>
              <Input type="password" placeholder="Password" v-bind="componentField" />
            </FormControl>
            <FormMessage/>
          </FormItem>
        </FormField>

        <Button type="submit" form="registerForm" class="flex w-full">
          Register
        </Button>
      </form>
      <p class="mt-7 text-center text-sm text-gray-500">
        Already have an account? 
        <RouterLink to="/" class="font-semibold text-primary hover:underline decoration-2">Login</RouterLink>
      </p>
    </div>
  </div>
</template>