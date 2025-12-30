import fetch from "node-fetch";

export class IntelligenceCore {
  constructor(config) {
    this.endpoint = "https://api.groq.com/openai/v1/chat/completions";
    this.key = config.apiKey;
    this.model = config.model || "groq/compound-mini";
  }

  FormulateInquiry(input) {
    return `You are Decide, an AI-native Evolutionary Health Co-pilot. 
Your goal is to reduce human cognitive effort by distilling complex nutritional/chemical data into a single, high-stakes decision brief.

PRINCIPLES:
- Intent Inference: If the user provides a product, assume they are asking "Should I consume this?". 
- Directness: Do not ask follow-up questions. Make the best decision based on the available data.
- Transparency: Clearly state what you know and what you are guessing.

STRUCTURE:
1. verdict: A definitive, weighted decision (e.g., "Safe Daily", "Avoid", "Restricted Consumption").
2. summary: A one-sentence explanation of the primary health impact.
3. keyFactors: 3-4 deep analytical bullets on metabolic or chemical significance.
4. usageRecommendation: Specific, actionable instructions (frequency, portion, or pairings).
5. benefits: 2-3 positive metabolic outlooks.
6. tradeoffs: 2-3 specific risks or long-term trade-offs.
7. ambiguity: Explicitly state what data is missing (e.g., "Exact fiber ratio unknown").
8. confidenceScore: A percentage (0-100%) indicating your certainty.
9. logicPath: 4-5 steps of your internal reasoning (e.g., "1. Isolated high fructose corn syrup...").

INPUT: "${input}"

FORMAT: Return ONLY a valid JSON object.`;
  }

  async Distill(content) {
    const inquiry = this.FormulateInquiry(content);
    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.key}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: "user", content: inquiry }],
        temperature: 0.1
      })
    });

    if (!res.ok) throw new Error(`Inference Engine Error: ${res.status}`);
    const data = await res.json();
    const rawContent = data.choices?.[0]?.message?.content || "";
    const jsonMatch = rawContent.match(/{[\s\S]*}/);
    if (!jsonMatch) throw new Error("Could not parse intellectual output.");
    return JSON.parse(jsonMatch[0]);
  }
}
