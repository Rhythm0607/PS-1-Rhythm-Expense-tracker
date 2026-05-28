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

// 1. Add 'expectJson = false' as an optional parameter
async function callGeminiAPI(message: string, expectJson: boolean = false): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY?.trim();
  if (!apiKey) throw new Error("GOOGLE_API_KEY not set");

  // 2. Build the base request body
  const requestBody: any = {
    contents: [{ parts: [{ text: message }] }],
  };

  // 3. Only apply the JSON lock if the function asked for it!
  if (expectJson) {
    requestBody.generationConfig = {
      responseMimeType: "application/json",
    };
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody), // Send the dynamic body
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

export async function parseNaturalLanguageExpense(text: string) {
  // 1. You likely already have your prompt and AI call here
 const today = new Date().toISOString().split("T")[0]; 

  const prompt = `
    You are a precise financial data extractor. Today's exact date is ${today}.
    
    CRITICAL INSTRUCTIONS:
    1. Respond ONLY with a raw JSON object.
    2. NEVER use words for dates. Calculate the exact "YYYY-MM-DD" date based on Today (${today}).

    EXAMPLES:
    Input: "I spent 50 on groceries yesterday"
    Output: {"amount": 50, "description": "groceries", "category": "Food & Dining", "date": "2026-05-27"}
    
    Input: "Paid 1500 for rent on the 5th"
    Output: {"amount": 1500, "description": "rent", "category": "Bills & Utilities", "date": "2026-05-05"}

    Input: "${text}"
    Output: 
  `; // (Keep whatever prompt you currently have)
  
  const rawAiResponse = await callGeminiAPI(prompt,true);
  
  // 2. Add this temporary log so you can see what Gemini is doing in your Mac Terminal
  console.log("Gemini sent back:", rawAiResponse);

  try {
    // 1. Find the first '{' and the last '}' in the AI's response
    const jsonMatch = rawAiResponse.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("No JSON object found in AI response");
    }

    // 2. Extract only that specific chunk
    const cleanString = jsonMatch[0];
    
    // 3. Safely parse it!
    return JSON.parse(cleanString);
    
  } catch (error) {
    console.error("Failed to parse the cleaned string:", error);
    throw new Error("Could not understand the AI response.");
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
