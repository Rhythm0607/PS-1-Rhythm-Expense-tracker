// Multi-model AI service - Choose any free model below
"use server";
type AIProvider = "claude" | "openai" | "gemini" | "groq";

const EXPENSE_CATEGORIES = [
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

// Set your preferred provider here
const PROVIDER: AIProvider = process.env.NEXT_PUBLIC_AI_PROVIDER as AIProvider || "claude";

async function callClaudeAPI(message: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: message }],
    }),
  });

  if (!response.ok) throw new Error(`Claude API error: ${response.status}`);
  const data = await response.json();
  return data.content[0].text || "";
}

async function callOpenAIAPI(message: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      max_tokens: 1024,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content || "";
}

async function callGeminiAPI(message: string): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY?.trim();
  if (!apiKey) throw new Error("GOOGLE_API_KEY not set");

  const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,    
      {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
      }),
    }
  );

  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
  const data = await response.json();
  return data.candidates[0].content.parts[0].text || "";
}
async function callGroqAPI(message: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not set");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      messages: [{ role: "user", content: message }],
      max_tokens: 1024,
    }),
  });

  if (!response.ok) throw new Error(`Groq API error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content || "";
}

async function callAI(message: string): Promise<string> {
  try {
    switch (PROVIDER) {
      case "openai":
        return await callOpenAIAPI(message);
      case "gemini":
        return await callGeminiAPI(message);
      case "groq":
        return await callGroqAPI(message);
      case "claude":
      default:
        return await callClaudeAPI(message);
    }
  } catch (error) {
    console.error(`AI call failed (${PROVIDER}):`, error);
    throw error;
  }
}

export async function categorizeExpense(description: string): Promise<string> {
  const prompt = `Categorize this expense description into ONE of these categories: ${EXPENSE_CATEGORIES.join(", ")}

Expense description: "${description}"

Respond with ONLY the category name, nothing else.`;

  try {
    const category = await callAI(prompt);
    const cleaned = category.trim();
    return EXPENSE_CATEGORIES.includes(cleaned) ? cleaned : "Other";
  } catch (error) {
    console.error("Categorization failed:", error);
    return "Other";
  }
}

export async function generateMonthlyInsights(
  expenses: Array<{ amount: number; category: string; date: string }>,
  month: string
): Promise<string> {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = expenses.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const categoryString = Object.entries(byCategory)
    .map(([cat, amount]) => `${cat}: ₹${amount.toFixed(2)}`)
    .join(", ");

  const prompt = `Analyze this spending data for ${month} and provide 2-3 brief, actionable insights. Be concise and friendly.

Total spent: ₹${totalSpent.toFixed(2)}
Breakdown: ${categoryString}
Number of transactions: ${expenses.length}

Give insights about spending patterns and 1 suggestion for savings.`;

  try {
    return await callAI(prompt);
  } catch (error) {
    console.error("Insights generation failed:", error);
    return "Unable to generate insights at this time.";
  }
}

export async function parseNaturalLanguageExpense(input: string): Promise<{
  amount: number;
  description: string;
  date: string;
}> {
  const prompt = `Parse this expense entry and extract:
1. Amount (number only)
2. Description (what was bought)
3. Date (in YYYY-MM-DD format, use today if not specified)

Input: "${input}"

Respond ONLY in this JSON format:
{"amount": number, "description": "text", "date": "YYYY-MM-DD"}`;

  try {
    const text = await callAI(prompt);
    return JSON.parse(text);
  } catch (error) {
    console.error("Parsing failed:", error);
    return {
      amount: 0,
      description: input,
      date: new Date().toISOString().split("T")[0],
    };
  }
}

export async function getProviderInfo(): Promise<{
  name: string;
  freeCredits: string;
  getKeyURL: string;
  envVar: string;
 
}>{
  const providers: Record<AIProvider, any> = {
    claude: {
      name: "Claude (Anthropic)",
      freeCredits: "$5",
      getKeyURL: "https://console.anthropic.com",
      envVar: "ANTHROPIC_API_KEY",
    },
    openai: {
      name: "GPT-3.5 (OpenAI)",
      freeCredits: "$5",
      getKeyURL: "https://platform.openai.com/api-keys",
      envVar: "OPENAI_API_KEY",
    },
    gemini: {
      name: "Gemini (Google)",
      freeCredits: "Free",
      getKeyURL: "https://ai.google.dev",
      envVar: "GOOGLE_API_KEY",
    },
    groq: {
      name: "Mixtral (Groq)",
      freeCredits: "Free",
      getKeyURL: "https://console.groq.com",
      envVar: "GROQ_API_KEY",
    },
  };

  return providers[PROVIDER];
}
