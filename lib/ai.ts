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

async function callClaudeAPI(message: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not set");
  }

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

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0].text || "";
}

export async function categorizeExpense(description: string): Promise<string> {
  const prompt = `Categorize this expense description into ONE of these categories: ${EXPENSE_CATEGORIES.join(", ")}

Expense description: "${description}"

Respond with ONLY the category name, nothing else.`;

  try {
    const category = await callClaudeAPI(prompt);
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
    return await callClaudeAPI(prompt);
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
    const text = await callClaudeAPI(prompt);
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
