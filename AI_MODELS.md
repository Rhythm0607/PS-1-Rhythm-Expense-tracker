# 🤖 Choose Your AI Model

This project supports **4 free AI models**. Pick one and follow the setup.

---

## 1️⃣ Claude (Recommended) ⭐

### Why Choose?
- ✅ Best for reasoning & summarization
- ✅ Great for expense categorization
- ✅ $5 free credits
- ✅ Easiest to use

### Setup
1. Go to https://console.anthropic.com
2. Sign up (free)
3. Create API key
4. Add to `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
NEXT_PUBLIC_AI_PROVIDER=claude
```

### Cost
- $5 free credits = ~1,000 API calls
- After: $0.003 per 1K input tokens, $0.015 per 1K output tokens

---

## 2️⃣ OpenAI GPT-3.5

### Why Choose?
- ✅ Very reliable
- ✅ $5 free credits
- ✅ Slightly cheaper than Claude
- ✅ Industry standard

### Setup
1. Go to https://platform.openai.com/api-keys
2. Sign up (free)
3. Create API key
4. Add to `.env.local`:
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
NEXT_PUBLIC_AI_PROVIDER=openai
```

### Cost
- $5 free credits = ~10,000 API calls
- After: $0.50 per 1M input tokens

---

## 3️⃣ Google Gemini (Free, No Card) 🎉

### Why Choose?
- ✅ **Completely free** (no credit card!)
- ✅ No trial credits needed
- ✅ Fast & reliable
- ✅ Good for getting started

### Setup
1. Go to https://ai.google.dev
2. Click "Get API Key"
3. Create new API key in Google Cloud
4. Add to `.env.local`:
```
GOOGLE_API_KEY=AIxxxxxxxxxxxxx
NEXT_PUBLIC_AI_PROVIDER=gemini
```

### Cost
- **Free tier**: 60 requests/minute
- Always free for small usage
- Perfect for testing!

---

## 4️⃣ Groq (Free & Fastest)

### Why Choose?
- ✅ **Super fast** (token streaming)
- ✅ Free tier available
- ✅ Great for real-time
- ✅ Generous rate limits

### Setup
1. Go to https://console.groq.com
2. Sign up (free)
3. Create API key
4. Add to `.env.local`:
```
GROQ_API_KEY=gsk-xxxxxxxxxxxxx
NEXT_PUBLIC_AI_PROVIDER=groq
```

### Cost
- Free tier: 2,000 requests/day
- After: Pay-as-you-go pricing

---

## 📊 Comparison

| Model | Free Trial | No Card Needed | Speed | Quality | Cost |
|-------|-----------|---------|-------|---------|------|
| **Claude** | $5 | No | 🟡 | ⭐⭐⭐⭐⭐ | Low |
| **OpenAI** | $5 | No | 🟡 | ⭐⭐⭐⭐ | Very Low |
| **Gemini** | ✅ | ✅ | 🟢 | ⭐⭐⭐⭐ | Free |
| **Groq** | ✅ | No | 🟢🟢 | ⭐⭐⭐⭐ | Very Low |

---

## 🚀 Recommended Setup for Beginners

1. **Start with Gemini** (no credit card needed)
2. **Switch to Claude** once you feel comfortable (better quality)
3. **Use Groq** if you want speed

---

## 🔄 How to Switch Models

### In `.env.local`:
```
# Choose ONE of these:
ANTHROPIC_API_KEY=sk-ant-xxxxx        # For Claude
OPENAI_API_KEY=sk-xxxxx                # For OpenAI
GOOGLE_API_KEY=AIxxxxx                 # For Gemini
GROQ_API_KEY=gsk-xxxxx                 # For Groq

# Then set which one to use:
NEXT_PUBLIC_AI_PROVIDER=claude         # Options: claude, openai, gemini, groq
```

### Restart your dev server:
```bash
npm run dev
```

---

## ✅ Testing Your Setup

After adding your API key, test it:

1. Start the app: `npm run dev`
2. Go to http://localhost:3000
3. Sign up
4. Add an expense with description
5. Click sparkles icon to auto-categorize
6. If it works → AI is connected! ✅

---

## 💡 My Recommendation

For this project, I recommend:

### Best Overall: **Claude**
- Most reliable categorization
- Best insights generation
- $5 is plenty for testing

### Most Affordable: **Gemini**
- Actually free (no card)
- Great quality
- Perfect if you don't have a card

### Fastest: **Groq**
- Super quick responses
- Free tier is generous
- Best for real-time

---

## 🆘 Common Issues

### "API Key Invalid"
- Check you copied it correctly
- Make sure `.env.local` is in root folder
- Restart dev server: Ctrl+C then `npm run dev`

### "Rate limit exceeded"
- You're making too many requests
- Wait a minute and try again
- Or upgrade to paid plan

### "Model not found"
- Make sure `NEXT_PUBLIC_AI_PROVIDER` matches your key
- Check spelling: `claude`, `openai`, `gemini`, or `groq`

---

## 📚 Learn More

- [Claude API Docs](https://docs.anthropic.com)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Google Gemini Docs](https://ai.google.dev/docs)
- [Groq API Docs](https://console.groq.com/docs)

---

**Pick one and start building! 🚀**

(You can always switch later if you want to try a different model.)
