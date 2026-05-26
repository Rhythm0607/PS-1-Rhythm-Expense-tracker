# 🚀 AI Expense Tracker - Complete Setup Guide

## Project Structure

```
expense-tracker/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (redirects)
│   ├── auth/
│   │   └── page.tsx        # Login/signup
│   ├── dashboard/
│   │   └── page.tsx        # Main dashboard
│   └── globals.css         # Global styles
├── components/
│   ├── Dashboard.tsx       # Charts & insights
│   ├── AddExpenseForm.tsx  # Add expense with AI
│   └── ExpenseList.tsx     # Expense list
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── store.ts           # Zustand store
│   └── ai.ts              # Claude AI functions
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── .env.local             # Environment variables
```

## 🔧 Setup Instructions

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Copy your `Project URL` and `Anon Key`
4. Go to SQL Editor and run the contents of `supabase-schema.sql`

### Step 2: Get Claude API Key
1. Visit https://console.anthropic.com
2. Create an API key
3. Save it securely

### Step 3: Set Up Environment Variables
Replace values in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
ANTHROPIC_API_KEY=your_claude_api_key
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000 and sign up!

---

## 📊 Features

### Core Features
- ✅ User authentication (Supabase Auth)
- ✅ Add/edit/delete expenses
- ✅ Filter by date and category
- ✅ Monthly dashboard with charts
- ✅ Budget tracking per category

### AI Features
1. **Smart Categorization** - Automatically categorize expenses using Claude
2. **Natural Language Input** - Type "spent 500 on groceries" → AI parses it
3. **Monthly Insights** - AI analyzes spending and gives actionable advice
4. **Auto-suggest Budget** - AI recommends budgets based on habits (can add)

---

## 🧠 AI Integration Details

### 1. Auto-Categorization
When adding an expense, click the sparkles icon to auto-categorize based on description.

**Categories:**
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Health & Fitness
- Education
- Travel
- Personal Care
- Other

### 2. Natural Language Input
Click "Use natural language instead" to:
- Type: "spent 500 on groceries yesterday"
- AI parses: amount, description, date
- Then auto-categorizes

### 3. Monthly Insights
Generate AI insights about:
- Spending patterns
- Budget suggestions
- Savings opportunities
- Category trends

---

## 🎨 Design Features

- **Dark theme** with gradient background
- **Responsive** - Works on mobile & desktop
- **Charts** - Pie chart (categories), bar chart (daily)
- **Smooth animations** - Fade-in effects
- **Color-coded categories** - Each category has a color

---

## 📱 Next Steps (Day 3)

### Polish & Deploy
1. **Fix responsive bugs** on mobile
2. **Add more AI features**:
   - Spending trends
   - Savings predictions
   - Budget alerts
3. **Deploy**:
   ```bash
   npm run build
   # Deploy to Vercel
   vercel
   ```

### Optional Enhancements
- Add recurring expenses
- Export to PDF/CSV
- Budget alerts when exceeding
- Monthly reminders
- Analytics dashboard

---

## 🚨 Troubleshooting

### "Supabase connection failed"
- Check `.env.local` values
- Ensure project is active on Supabase

### "Claude API error"
- Verify API key is correct
- Check rate limits
- Ensure you have credits

### "Auth not working"
- Clear browser cache
- Check Supabase Auth settings
- Verify email confirmation is enabled

---

## 📚 Useful Resources

- [Supabase Docs](https://supabase.com/docs)
- [Claude API Docs](https://docs.anthropic.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Recharts Docs](https://recharts.org)

---

## 🎯 Estimated Timeline

- **Day 1**: Setup + auth + basic UI = 6 hours
- **Day 2**: Add expenses + charts + AI = 6 hours
- **Day 3**: Polish + deploy = 4 hours

**Total**: ~16 hours of work for a production-ready app!

---

Happy tracking! 💰
