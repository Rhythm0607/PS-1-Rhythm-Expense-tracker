"use client";

import { useState } from "react";
import AddExpenseForm, { ExpenseData } from "./AddExpenseForm";
import { useExpenseStore } from "@/lib/store";
import { format } from "date-fns";
import { Trash2, Calendar, FilterX, Download } from "lucide-react"; // Added Download icon
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExpenseList() {
  const { expenses, deleteExpense, loading } = useExpenseStore();
  const [editingExpense, setEditingExpense] = useState<ExpenseData | null>(null);
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
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

  const filteredExpenses = expenses.filter((expense) => {
    if (!startDate && !endDate) return true;
    const expDate = new Date(expense.date);
    const start = startDate ? new Date(startDate) : new Date("2000-01-01");
    const end = endDate ? new Date(endDate) : new Date("2100-01-01");
    return expDate >= start && expDate <= end;
  });

  const filteredTotal = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // --- THE PDF GENERATOR FUNCTION ---
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // 1. Add Title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("Expense Report", 14, 22);
    
    // 2. Add Subtitle (Date Range & Total)
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    const dateText = (startDate && endDate) ? `From: ${startDate} To: ${endDate}` : "All Time";
    doc.text(`Period: ${dateText} | Total: Rs. ${filteredTotal.toFixed(2)}`, 14, 30);

    // 3. Format data for the table
    const tableColumn = ["Date", "Description", "Category", "Amount (Rs)"];
    const tableRows = filteredExpenses.map(exp => [
      format(new Date(exp.date), "MMM dd, yyyy"),
      exp.description,
      exp.category,
      exp.amount.toFixed(2)
    ]);

    // 4. Draw the table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    
    // 5. Download the file
    const filename = startDate && endDate ? `ExpenseReport_${startDate}_to_${endDate}.pdf` : `ExpenseReport_All.pdf`;
    doc.save(filename);
  };

  return (
    <>
      <div className="card mb-4 bg-slate-800/50 p-4 border border-slate-700 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap flex-1">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-slate-400" />
            <input 
              type="date" 
              className="input py-1 px-2 text-sm max-w-[140px]" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <span className="text-slate-500">to</span>
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              className="input py-1 px-2 text-sm max-w-[140px]" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          
          {(startDate || endDate) && (
            <button 
              onClick={() => { setStartDate(""); setEndDate(""); }}
              className="text-slate-400 hover:text-red-400 transition ml-2 flex items-center gap-1 text-sm"
              title="Clear Filters"
            >
              <FilterX size={16} /> Clear
            </button>
          )}
        </div>
        
        {/* Total and Download Button Container */}
        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <p className="text-xs text-slate-400">Filtered Total</p>
            <p className="text-lg font-bold text-white">₹{filteredTotal.toFixed(2)}</p>
          </div>
          
          {/* THE NEW PDF BUTTON */}
          <button 
            onClick={generatePDF}
            disabled={filteredExpenses.length === 0}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={14} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No expenses found for this date range.</p>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <div key={expense.id} className="card flex items-center justify-between p-4 hover:bg-slate-700/50 transition border border-slate-800 rounded-xl">
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
                  onClick={() => setEditingExpense(expense)}
                  className="text-blue-400 hover:text-blue-300 transition"
                  title="Edit expense"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="btn btn-danger px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition"
                  title="Delete expense"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {editingExpense && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md relative">
            <AddExpenseForm 
              initialData={editingExpense} 
              onClose={() => setEditingExpense(null)} 
            />
          </div>
        </div>
      )}
    </>
  );
}