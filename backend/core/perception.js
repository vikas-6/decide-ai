import sharp from "sharp";
import fetch from "node-fetch";
import Tesseract from "tesseract.js";

const DATA_SIGNATURES = [
  "ingredients", "contains", "water", "sugar", "salt", "spices", "protein", "fat", "sodium", "mg", "kcal"
];

const ANALYTIC_PATTERNS = [
  /\d+\s*(mg|g|kg|ml|l|oz|lb|%)/i,
  /calories\s*:?\s*\d+/i
];

function ScoreRelevance(content) {
  if (!content || content.trim().length < 10) return { valid: false, score: 0 };
  const normalized = content.toLowerCase();
  let score = 0;
  DATA_SIGNATURES.forEach(sig => {
    if (normalized.includes(sig)) score += 5;
  });
  return { valid: score > 10, score };
}

export async function OptimizeInput(buffer, mobile = false) {
  const meta = await sharp(buffer).metadata();
  const targetWidth = mobile ? 1800 : 2400;
  return await sharp(buffer)
    .resize(Math.min(meta.width, targetWidth), null, { withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toBuffer();
}

export async function ExtractVisualData(buffer) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const base64 = buffer.toString("base64");
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Extract ONLY the functional ingredient list from this data. Return text only." },
              { inline_data: { mime_type: "image/jpeg", data: base64 } }
            ]
          }]
        })
      });
      const json = await res.json();
      const raw = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (raw) return { text: raw.trim(), source: "vision_engine" };
    } catch (e) {
      console.error("[Perception] Vision Engine failed, falling back.");
    }
  }

  const { data: { text } } = await Tesseract.recognize(buffer, "eng");
  return { text, source: "optical_fallback" };
}
