import { ref, onMounted } from 'vue';
import type { Category } from '@/types/Category';
import axios from "axios"

export function getAllCategories() {
  const categories = ref<Category[]>([])

  onMounted(async () => {
    await axios.get('http://localhost:8080/api/categories').then(response => {
      categories.value = response.data.data
    }).catch(error => {
      console.error(error);
    })
  })

  return categories
}