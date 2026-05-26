"use client";

import { useExpenseStore, type Expense } from "@/lib/store";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

export default function ExpenseList() {
  const { expenses, deleteExpense, loading } = useExpenseStore();

  const categoryColors: Record<string, string> = {
    "Food & Dining": "bg-orange-500/20 text-orange-300",
    Transportation: "bg-blue-500/20 text-blue-300",
    Shopping: "bg-pink-500/20 text-pink-300",
    Entertainment: "bg-purple-500/20 text-purple-300",
    "Bills & Utilities": "bg-red-500/20 text-red-300",
    "Health & Fitness": "bg-green-500/20 text-green-300",
    Education: "bg-indigo-500/20 text-indigo-300",
    Travel: "bg-cyan-500/20 text-cyan-300",
    "Personal Care": "bg-yellow-500/20 text-yellow-300",
    Other: "bg-slate-500/20 text-slate-300",
  };

  if (loading) {
    return <div className="text-center text-slate-400">Loading expenses...</div>;
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">No expenses yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div key={expense.id} className="card flex items-center justify-between p-4 hover:bg-slate-700/50 transition">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[expense.category] || categoryColors.Other}`}>
                {expense.category}
              </span>
              <span className="text-slate-400 text-sm">{format(new Date(expense.date), "MMM dd, yyyy")}</span>
            </div>
            <p className="text-white font-medium">{expense.description}</p>
          </div>

          <div className="flex items-center gap-4 ml-4">
            <span className="text-lg font-bold text-green-400">₹{expense.amount.toFixed(2)}</span>
            <button
              onClick={() => deleteExpense(expense.id)}
              className="btn btn-danger px-3 py-2"
              title="Delete expense"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
