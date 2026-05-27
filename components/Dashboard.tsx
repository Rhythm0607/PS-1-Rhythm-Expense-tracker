"use client";

import { useEffect, useState } from "react";
import { useExpenseStore } from "@/lib/store";
import { generateMonthlyInsights } from "@/lib/ai-multi-model";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { Sparkles } from "lucide-react";

export default function Dashboard() {
  const { expenses } = useExpenseStore();
  const [insights, setInsights] = useState("");
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const currentMonth = format(selectedMonth, "yyyy-MM");
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);

  const monthlyExpenses = expenses.filter((e) => {
    const expenseDate = new Date(e.date);
    return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
  });

  const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryData = Object.entries(
    monthlyExpenses.reduce(
      (acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      },
      {} as Record<string, number>
    )
  ).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  const dailyData = monthlyExpenses.reduce(
    (acc, e) => {
      const day = format(new Date(e.date), "dd");
      const existing = acc.find((d) => d.day === day);
      if (existing) {
        existing.amount += e.amount;
      } else {
        acc.push({ day, amount: e.amount });
      }
      return acc;
    },
    [] as Array<{ day: string; amount: number }>
  );

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316", "#84cc16", "#14b8a6"];

  const fetchInsights = async () => {
    if (monthlyExpenses.length === 0) {
      setInsights("No expenses this month to analyze.");
      return;
    }

    setLoadingInsights(true);
    try {
      const result = await generateMonthlyInsights(monthlyExpenses, format(selectedMonth, "MMMM yyyy"));
      setInsights(result);
    } catch (error) {
      console.error("Failed to generate insights:", error);
      setInsights("Failed to generate insights. Try again.");
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    setInsights("");
  }, [selectedMonth]);
  // Sort categories so the highest spending always comes first
  const sortedCategoryData = [...categoryData].sort((a, b) => b.value - a.value);
  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{format(selectedMonth, "MMMM yyyy")}</h2>
        <input
          type="month"
          className="input w-40"
          value={currentMonth}
          onChange={(e) => setSelectedMonth(new Date(e.target.value + "-01"))}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-slate-400 text-sm mb-1">Total Spent</p>
          <p className="text-3xl font-bold text-green-400">₹{totalSpent.toFixed(2)}</p>
          <p className="text-slate-400 text-xs mt-2">{monthlyExpenses.length} transactions</p>
        </div>

        <div className="card">
          <p className="text-slate-400 text-sm mb-1">Average per Day</p>
          <p className="text-3xl font-bold text-blue-400">
            ₹{monthlyExpenses.length > 0 ? (totalSpent / 30).toFixed(2) : "0.00"}
          </p>
          <p className="text-slate-400 text-xs mt-2">30-day average</p>
        </div>

        <div className="card">
  <p className="text-slate-400 text-sm mb-1">Top Category</p>
  <p className="text-3xl font-bold text-purple-400">
    {sortedCategoryData.length > 0 ? sortedCategoryData[0].name.split(" ")[0] : "—"}
  </p>
  <p className="text-slate-400 text-xs mt-2">
    {sortedCategoryData.length > 0 ? `₹${sortedCategoryData[0].value.toFixed(2)}` : "No data"}
  </p>
</div>
      </div>

      {/* Charts */}
      {monthlyExpenses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <div className="card">
            <h3 className="font-bold text-lg mb-4">Spending by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Spending */}
          <div className="card">
            <h3 className="font-bold text-lg mb-4">Daily Spending</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                  formatter={(value) => `₹${value.toFixed(2)}`}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">💡 Monthly Insights</h3>
          <button
            onClick={fetchInsights}
            disabled={loadingInsights || monthlyExpenses.length === 0}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Sparkles size={16} />
            {loadingInsights ? "Analyzing..." : "Generate"}
          </button>
        </div>

        {insights && (
          <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
            {insights}
          </div>
        )}

        {!insights && !loadingInsights && monthlyExpenses.length > 0 && (
          <p className="text-slate-400 text-sm">Click "Generate" to get AI insights about your spending.</p>
        )}
      </div>
    </div>
  );
}
