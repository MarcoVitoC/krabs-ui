import type { Category } from '@/types/Category';

export interface Expense {
  id: string;
  category: Category;
  description: string;
  amount: number;
  paymentMethod: string;
}