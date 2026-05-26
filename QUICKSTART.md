# 🏃 Quick Start Guide

## 1. Clone/Download the project
```bash
cd expense-tracker
```

## 2. Install dependencies
```bash
npm install
```

## 3. Set up Supabase
- Create account at https://supabase.com
- Create a new project
- In SQL Editor, paste contents of `supabase-schema.sql`
- Copy Project URL and Anon Key

## 4. Set up Claude API
- Get API key from https://console.anthropic.com
- Save your API key

## 5. Configure environment
Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

## 6. Start dev server
```bash
npm run dev
```

## 7. Visit app
Open http://localhost:3000 and sign up!

---

## 🎯 What Can You Do?

### Add Expenses
- Click "Add Expense" button
- Either:
  - **Manual entry**: Amount, description, date, category
  - **AI mode**: Type naturally like "spent 500 on pizza"

### Auto-Categorize
- Type a description
- Click sparkles icon
- AI suggests the category

### View Dashboard
- See monthly spending summary
- Charts (pie & bar)
- AI insights with "Generate" button

### Track by Category
- Color-coded expense list
- Filter by date
- Delete expenses

---

## 💡 Pro Tips

1. **AI Categorization** - Let AI tag your expenses, saves time
2. **Natural Language** - "paid rent 10000" works great
3. **Monthly Insights** - Click Generate to see AI suggestions
4. **Budget Setup** - Add budget limits per category (coming soon)

---

## 🔑 Key Files

- `lib/ai.ts` - All Claude API calls
- `lib/store.ts` - State management
- `components/Dashboard.tsx` - Charts & insights
- `components/AddExpenseForm.tsx` - Expense input
- `app/dashboard/page.tsx` - Main UI

---

## ❓ Issues?

- **Auth fails** → Check Supabase project is active
- **AI not working** → Verify ANTHROPIC_API_KEY is set
- **No charts** → Make sure you have expenses added

---

**Happy tracking! 💰**
