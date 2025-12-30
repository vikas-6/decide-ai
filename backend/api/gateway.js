import express from "express";
import { OptimizeInput, ExtractVisualData } from "../core/perception.js";
import { IntelligenceCore } from "../core/intelligence.js";
import { env } from "../infrastructure/environment.js";

const router = express.Router();
const brain = new IntelligenceCore({ apiKey: env.GROQ_API_KEY, model: env.GROQ_MODEL });

router.post("/resolve", async (req, res, next) => {
  try {
    const { visualPayload, literalInput } = req.body;
    let rawData = literalInput || "";

    if (visualPayload) {
      const base64Clean = visualPayload.includes(",") ? visualPayload.split(",")[1] : visualPayload;
      const buffer = Buffer.from(base64Clean, "base64");
      const optimized = await OptimizeInput(buffer);
      const { text } = await ExtractVisualData(optimized);
      rawData = text;
    }

    if (!rawData) return res.status(400).json({ status: "error", message: "No data perceived." });

    const insight = await brain.Distill(rawData);
    
    // Cognitive validation for demo stability
    if (!insight.verdict || !insight.keyFactors) {
      throw new Error("Distillation yielded incomplete intelligence.");
    }

    res.json({ status: "success", data: insight });
  } catch (e) {
    console.error(`[Gateway] Distillation Failure: ${e.message}`);
    res.status(500).json({ status: "error", message: "Intelligence layer temporarily offline." });
  }
});

export default router;
