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
  updateExpense: (id: string, updatedData: any) => Promise<void>; // Added perfectly here!
  addBudget: (budget: Omit<Budget, "id" | "user_id" | "created_at">) => Promise<void>;
  updateBudget: (id: string, monthly_limit: number) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    set({ user: data.user });
  },
  
  signup: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    set({ user: data.user });
  },
  
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
    // Reload the page to clear the expense store state
    if (typeof window !== 'undefined') window.location.reload();
  },
  
  checkAuth: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({ user: session?.user || null, loading: false });
  },
}));

export const useExpenseStore = create<ExpenseStore>((set) => ({
  expenses: [],
  budgets: [],
  loading: false,

  fetchExpenses: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching expenses:", error);
      set({ loading: false });
      return;
    }
    set({ expenses: data || [], loading: false });
  },

  fetchBudgets: async () => {
    const { data, error } = await supabase.from("budgets").select("*");
    if (error) {
      console.error("Error fetching budgets:", error);
      return;
    }
    set({ budgets: data || [] });
  },

  addExpense: async (expense) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const { data, error } = await supabase
      .from("expenses")
      .insert([{ ...expense, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error("Error adding expense:", error);
      return;
    }

    set((state) => {
      const updatedExpenses = [...state.expenses, data];
      // Keep expenses sorted by date, newest first
      updatedExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return { expenses: updatedExpenses };
    });
  },

  updateExpense: async (id, updatedData) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .update(updatedData)
        .eq('id', id);

      if (error) throw error;

      // After updating the database, update the local state array so the UI changes instantly
      set((state) => ({
        expenses: state.expenses.map((expense) => 
          expense.id === id ? { ...expense, ...updatedData } : expense
        )
      }));
    } catch (error) {
      console.error("Failed to update expense:", error);
    }
  },

  deleteExpense: async (id) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    
    if (error) {
      console.error("Error deleting expense:", error);
      return;
    }

    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
    }));
  },

  addBudget: async (budget) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const { data, error } = await supabase
      .from("budgets")
      .insert([{ ...budget, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error("Error adding budget:", error);
      return;
    }

    set((state) => ({ budgets: [...state.budgets, data] }));
  },

  updateBudget: async (id, monthly_limit) => {
    const { data, error } = await supabase
      .from("budgets")
      .update({ monthly_limit })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating budget:", error);
      return;
    }

    set((state) => ({
      budgets: state.budgets.map((item) => (item.id === id ? data : item)),
    }));
  },
}));