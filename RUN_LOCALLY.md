# 🚀 How to Run the Project on Your Computer

The project needs to be run on **your local machine** (not a server), since it requires internet access to npm and the APIs.

---

## ✅ What You Need

1. **Node.js** (v18+) — [Download here](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **A code editor** — VS Code recommended ([Download](https://code.visualstudio.com/))

---

## 📥 Step 1: Extract the ZIP

1. **Download** `expense-tracker.zip` from above
2. **Extract it** (right-click → Extract All)
3. **Open terminal/PowerShell** in the `expense-tracker` folder

---

## 🔑 Step 2: Set Up Environment Variables

Create a file called `.env.local` in the `expense-tracker` folder with:

```
ANTHROPIC_API_KEY=sk-ant-xxxxx-your-key-here
```

**Get your API key:**
- Go to https://console.anthropic.com
- Create an API key
- Paste it in `.env.local`

**Note:** For this demo, Supabase is replaced with localStorage (your data stays in browser). When you deploy, add real Supabase keys.

---

## 📦 Step 3: Install Dependencies

In your terminal, run:

```bash
npm install
```

This will download all packages (~205 packages).

**Expected output:**
```
added 205 packages, and audited 206 packages in 2m
```

> ⚠️ Ignore the warnings — they're safe to ignore.

---

## 🎯 Step 4: Start Development Server

Run:

```bash
npm run dev
```

**You should see:**
```
> ai-expense-tracker@1.0.0 dev
> next dev

  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
```

---

## 🌐 Step 5: Open in Browser

1. Open your browser
2. Go to **http://localhost:3000**
3. You should see the login page! 🎉

---

## 👤 Step 6: Sign Up & Test

1. **Sign up** with any email/password (it's a demo, no real auth)
2. Click "Add Expense"
3. Try:
   - **Manual entry**: Add amount, description, date
   - **AI mode**: Type "spent 500 on pizza" → AI parses it
   - **Auto-categorize**: Click sparkles icon

---

## 🛠️ Troubleshooting

### "npm install fails"
- Make sure you have Node.js v18+ installed
- Run `node --version` to check
- If not, download from https://nodejs.org/

### "Port 3000 already in use"
- Change to a different port:
  ```bash
  npm run dev -- -p 3001
  ```
- Then visit http://localhost:3001

### "API key not working"
- Check `.env.local` exists in the root folder
- Make sure your Claude API key is correct
- Restart the dev server after adding the key

### "localStorage undefined"
- This is a client-side error, usually in development
- Try clearing cache: Ctrl+Shift+Delete (browser)
- Restart the server: Ctrl+C then `npm run dev`

---

## 📁 Project Structure

```
expense-tracker/
├── app/
│   ├── page.tsx           ← Home page
│   ├── auth/page.tsx      ← Login/signup
│   └── dashboard/page.tsx ← Main app
├── components/
│   ├── Dashboard.tsx      ← Charts
│   ├── AddExpenseForm.tsx ← Add expenses
│   └── ExpenseList.tsx    ← Expense list
├── lib/
│   ├── ai.ts             ← Claude API calls
│   ├── supabase.ts       ← Mock database
│   └── store.ts          ← State management
├── .env.local            ← Your API key
└── package.json          ← Dependencies
```

---

## 🎨 What You Can Do

### Add Expenses
- Manual: Amount + Description + Date + Category
- AI Mode: "spent 500 on pizza yesterday"

### Auto-Categorize
- Describe expense → AI picks category (Food, Transport, etc.)

### View Charts
- Pie chart: Spending by category
- Bar chart: Daily spending
- Summary cards: Total, average, top category

### Get Insights
- Click "Generate" to get AI analysis
- See spending patterns & suggestions

---

## 🚀 Next: Deploy Your App

When you're ready to deploy:

1. **Add Real Supabase** (instead of localStorage):
   - Create account at https://supabase.com
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
   - Run the SQL in `supabase-schema.sql`

2. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Add environment variables** in Vercel dashboard

---

## ✨ Tips

- **Save your API key somewhere safe** — you'll need it if you lose `.env.local`
- **Data is stored in browser** (localStorage) — clears when you clear cache
- **For production**, use real Supabase + proper database
- **Test everything locally first** before deploying

---

## 📚 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Claude API Docs](https://docs.anthropic.com)
- [Recharts](https://recharts.org)
- [Zustand](https://github.com/pmndrs/zustand)

---

**You're all set! 🚀 Start building!**

Any questions? Check the SETUP.md or QUICKSTART.md files.
