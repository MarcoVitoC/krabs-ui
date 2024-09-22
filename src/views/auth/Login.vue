<script setup lang="ts">
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth';
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'

const authStore = useAuthStore()

const formSchema = toTypedSchema(z.object({
  username: z.string({required_error: 'Username field cannot be empty!'})
    .min(1, 'This field cannot be empty!'),
  password: z.string({required_error: 'Password field cannot be empty!'})
    .min(1, 'This field cannot be empty!')
}))

const form = useForm({
  validationSchema: formSchema
})

const onSubmit = form.handleSubmit(async (user) => {
  await authStore.login(user)
})
</script>

<template>
  <div class="">
    <h1>Login</h1>
    <form id="loginForm" @submit="onSubmit">
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

      <Button type="submit" form="loginForm">
        Save
      </Button>
    </form>
    <RouterLink to="/register" class="font-bold">Register</RouterLink>
  </div>
</template>