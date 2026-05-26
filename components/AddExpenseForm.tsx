"use client";

import { useState } from "react";
import { useExpenseStore } from "@/lib/store";
import { categorizeExpense, parseNaturalLanguageExpense } from "@/lib/ai-multi-model";
import { Plus, Sparkles } from "lucide-react";

interface AddExpenseFormProps {
  onClose: () => void;
}

export default function AddExpenseForm({ onClose }: AddExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const { addExpense } = useExpenseStore();

  const categories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Health & Fitness",
    "Education",
    "Travel",
    "Personal Care",
    "Other",
  ];

  const handleAIInput = async () => {
    if (!description) return;
    setLoading(true);
    try {
      const parsed = await parseNaturalLanguageExpense(description);
      setAmount(parsed.amount.toString());
      setDate(parsed.date);
      setDescription(parsed.description);

      const autoCategory = await categorizeExpense(parsed.description);
      setCategory(autoCategory);
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
      await addExpense({
        amount: parseFloat(amount),
        description,
        date,
        category,
      });
      onClose();
    } catch (error) {
      console.error("Failed to add expense:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-bold">Add Expense</h2>

      {/* AI Natural Language Input */}
      {useAI ? (
        <div className="space-y-3">
          <label className="block text-sm font-medium">Describe your expense naturally</label>
          <textarea
            className="input h-20"
            placeholder="e.g., 'spent 500 on groceries yesterday' or 'paid 2000 for electricity bill'"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAIInput}
              disabled={loading || !description}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              Parse with AI
            </button>
            <button
              onClick={() => {
                setUseAI(false);
                setDescription("");
              }}
              className="btn-secondary flex-1"
            >
              Manual Entry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount (₹)</label>
            <input
              type="number"
              className="input"
              placeholder="500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <input
              type="text"
              className="input"
              placeholder="What did you buy?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <div className="flex gap-2 mb-3">
              <select
                className="input flex-1"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAutoCategory}
                disabled={loading || !description}
                className="btn btn-secondary px-3"
                title="Auto-categorize with AI"
              >
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? "Adding..." : "Add Expense"}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Toggle to AI mode */}
      {!useAI && (
        <button
          type="button"
          onClick={() => setUseAI(true)}
          className="text-blue-400 hover:text-blue-300 text-sm transition w-full text-center"
        >
          💬 Use natural language instead
        </button>
      )}
    </div>
  );
}
