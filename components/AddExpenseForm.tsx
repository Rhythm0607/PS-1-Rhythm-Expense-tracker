"use client";

import { useState, useEffect } from "react";
import { useExpenseStore } from "@/lib/store";
import { categorizeExpense, parseNaturalLanguageExpense } from "@/lib/ai-multi-model";
import { Sparkles } from "lucide-react";

// 1. We tell TypeScript exactly what an expense looks like
export interface ExpenseData {
  id: string | number;
  amount: number | string;
  description: string;
  date: string;
  category: string;
}

interface AddExpenseFormProps {
  onClose: () => void;
  initialData?: ExpenseData | null; // 2. Accept optional initial data for editing
}

export default function AddExpenseForm({ onClose, initialData }: AddExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [useAI, setUseAI] = useState(false);
  
  // Pull in BOTH add and update functions from your store
  const { addExpense, updateExpense } = useExpenseStore();

  const categories = [
    "Food & Dining", "Transportation", "Shopping", "Entertainment",
    "Bills & Utilities", "Health & Fitness", "Education", "Travel",
    "Personal Care", "Other",
  ];

  // 3. THE MAGIC PRE-FILL: If initialData exists, populate the form!
  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setDescription(initialData.description);
      setDate(initialData.date);
      setCategory(initialData.category);
    }
  }, [initialData]);

  const handleAIInput = async () => {
    if (!description) return;
    setLoading(true);
    try {
      const parsed = await parseNaturalLanguageExpense(description);

      setAmount(parsed.amount ? parsed.amount.toString() : "0");
      
      let finalDate = new Date().toISOString().split("T")[0];
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (parsed.date && dateRegex.test(parsed.date)) {
        finalDate = parsed.date;
      }
      setDate(finalDate);

      const finalDescription = parsed.description || description;
      setDescription(finalDescription);

      const autoCategory = await categorizeExpense(finalDescription);
      setCategory(autoCategory);

      setUseAI(false); // Auto-switch back to form view
    } catch (error) {
      console.error("AI parsing failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoCategory = async () => {
    if (!description) return;
    setLoading(true);
    try {
      const autoCategory = await categorizeExpense(description);
      setCategory(autoCategory);
    } catch (error) {
      console.error("Auto-categorization failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !date || !category) return;

    setLoading(true);
    try {
      const expenseData = {
        amount: parseFloat(amount),
        description,
        date,
        category,
      };

      // 4. CHOOSE THE PATH: Update or Add
      // 4. CHOOSE THE PATH: Update or Add
      if (initialData && initialData.id) {
        // String() forces it to be a string to satisfy your Supabase store
        await updateExpense(String(initialData.id), expenseData);
      } else {
        await addExpense(expenseData);
      }
      
      onClose();
    } catch (error) {
      console.error("Failed to save expense:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card space-y-4">
      {/* Dynamic Title */}
      <h2 className="text-xl font-bold">{initialData ? "Edit Expense" : "Add Expense"}</h2>

      {useAI && !initialData ? (
        <div className="space-y-3">
          <label className="block text-sm font-medium">Describe your expense naturally</label>
          <textarea
            className="input h-20"
            placeholder="e.g., 'spent 500 on groceries yesterday'"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={handleAIInput} disabled={loading || !description} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Sparkles size={16} /> Parse with AI
            </button>
            <button type="button" onClick={() => setUseAI(false)} className="btn-secondary flex-1">
              Manual Entry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount (₹)</label>
            <input type="number" className="input" placeholder="500" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <input type="text" className="input" placeholder="What did you buy?" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <div className="flex gap-2 mb-3">
              <select className="input flex-1" value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button type="button" onClick={handleAutoCategory} disabled={loading || !description} className="btn btn-secondary px-3" title="Auto-categorize with AI">
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
               {/* Dynamic Button Text */}
              {loading ? "Saving..." : initialData ? "Save Changes" : "Add Expense"}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      )}

      {!useAI && !initialData && (
        <button type="button" onClick={() => setUseAI(true)} className="text-blue-400 hover:text-blue-300 text-sm transition w-full text-center">
          💬 Use natural language instead
        </button>
      )}
    </div>
  );
}