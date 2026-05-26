import { create } from "zustand";
import { supabase } from "./supabase";

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  monthly_limit: number;
  created_at: string;
}

interface AuthStore {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface ExpenseStore {
  expenses: Expense[];
  budgets: Budget[];
  loading: boolean;
  fetchExpenses: () => Promise<void>;
  fetchBudgets: () => Promise<void>;
  addExpense: (expense: Omit<Expense, "id" | "user_id" | "created_at">) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, "id" | "user_id" | "created_at">) => Promise<void>;
  updateBudget: (id: string, monthly_limit: number) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  login: async (email: string, password: string) => {
    localStorage.setItem("user", JSON.stringify({ email, id: "user-" + Date.now() }));
    set({ user: { email, id: "user-" + Date.now() } });
  },
  signup: async (email: string, password: string) => {
    localStorage.setItem("user", JSON.stringify({ email, id: "user-" + Date.now() }));
    set({ user: { email, id: "user-" + Date.now() } });
  },
  logout: async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("expenses-data");
    localStorage.removeItem("budgets-data");
    set({ user: null });
  },
  checkAuth: async () => {
    const user = localStorage.getItem("user");
    set({ user: user ? JSON.parse(user) : null, loading: false });
  },
}));

export const useExpenseStore = create<ExpenseStore>((set) => ({
  expenses: [],
  budgets: [],
  loading: false,
  fetchExpenses: async () => {
    set({ loading: true });
    const data = JSON.parse(localStorage.getItem("expenses-data") || "[]");
    set({ expenses: data.sort((a: Expense, b: Expense) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ), loading: false });
  },
  fetchBudgets: async () => {
    const data = JSON.parse(localStorage.getItem("budgets-data") || "[]");
    set({ budgets: data });
  },
  addExpense: async (expense) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const user_id = user.id || "demo-user";
    
    const data = JSON.parse(localStorage.getItem("expenses-data") || "[]");
    data.push({
      ...expense,
      id: Math.random().toString(36),
      user_id,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem("expenses-data", JSON.stringify(data));
    
    set({ expenses: data.sort((a: Expense, b: Expense) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ) });
  },
  deleteExpense: async (id) => {
    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
    }));
    const data = JSON.parse(localStorage.getItem("expenses-data") || "[]");
    const filtered = data.filter((item: any) => item.id !== id);
    localStorage.setItem("expenses-data", JSON.stringify(filtered));
  },
  addBudget: async (budget) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const user_id = user.id || "demo-user";

    const data = JSON.parse(localStorage.getItem("budgets-data") || "[]");
    data.push({
      ...budget,
      id: Math.random().toString(36),
      user_id,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem("budgets-data", JSON.stringify(data));
    set({ budgets: data });
  },
  updateBudget: async (id, monthly_limit) => {
    const data = JSON.parse(localStorage.getItem("budgets-data") || "[]");
    const updated = data.map((item: any) =>
      item.id === id ? { ...item, monthly_limit } : item
    );
    localStorage.setItem("budgets-data", JSON.stringify(updated));
    set({ budgets: updated });
  },
}));
