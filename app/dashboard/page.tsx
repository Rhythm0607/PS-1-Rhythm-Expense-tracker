"use client";

import { useEffect, useState } from "react";
import { useAuthStore, useExpenseStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import ExpenseList from "@/components/ExpenseList";
import AddExpenseForm from "@/components/AddExpenseForm";
import { LogOut, Plus, TrendingDown } from "lucide-react";

export default function DashboardPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const { user, checkAuth, logout } = useAuthStore();
  const { fetchExpenses, fetchBudgets } = useExpenseStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchExpenses();
      fetchBudgets();
    }
  }, [user]);

  useEffect(() => {
    if (!user && !useAuthStore.getState().loading) {
      router.push("/auth");
    }
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">💰</div>
            <div>
              <h1 className="text-xl font-bold">ExpenseTracker</h1>
              <p className="text-xs text-slate-400">AI-powered expense management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setShowAddForm(true)} className="btn btn-primary flex items-center gap-2">
              <Plus size={18} />
              Add Expense
            </button>
            <button onClick={handleLogout} className="btn btn-secondary flex items-center gap-2">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Dashboard & Charts */}
          <div className="lg:col-span-2">
            <Dashboard />
          </div>

          {/* Right: Expenses & Form */}
          <div className="space-y-6">
            {showAddForm && <AddExpenseForm onClose={() => setShowAddForm(false)} />}

            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown size={20} />
                <h2 className="text-xl font-bold">Recent Expenses</h2>
              </div>
              <ExpenseList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
