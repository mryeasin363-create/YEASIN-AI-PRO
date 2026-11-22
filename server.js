import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";

const app = express();
const port = Number(process.env.PORT || 3000);
const allowed = (process.env.ALLOWED_ORIGINS || "*").split(",").map(x => x.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowed.includes("*") || allowed.includes(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed by CORS"));
  }
}));
app.use(express.json({ limit: "64kb" }));
app.use("/api/", rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: true, legacyHeaders: false }));

app.get("/health", (_req, res) => res.json({ ok: true, service: "YEASIN AI PRO API" }));

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "Backend-এ OPENAI_API_KEY সেট করা হয়নি।" });
    }
    const incoming = req.body?.messages;
    if (!Array.isArray(incoming) || incoming.length < 1 || incoming.length > 20) {
      return res.status(400).json({ error: "সঠিক messages পাঠান (১ থেকে ২০টি)।" });
    }
    const messages = incoming
      .filter(m => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string")
      .map(m => ({ role: m.role, content: m.content.slice(0, 6000) }));
    if (!messages.length) return res.status(400).json({ error: "বৈধ মেসেজ পাওয়া যায়নি।" });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "তুমি YEASIN AI PRO, একজন সহায়ক, নিরাপদ ও বন্ধুসুলভ AI সহকারী। ব্যবহারকারীর ভাষায় উত্তর দাও। তথ্য নিশ্চিত না হলে তা স্পষ্ট করো।" },
        ...messages
      ]
    });
    res.json({ reply: result.choices?.[0]?.message?.content || "উত্তর পাওয়া যায়নি।" });
  } catch (error) {
    console.error("API error:", error?.message || error);
    res.status(500).json({ error: "Backend বা AI provider-এ সমস্যা হয়েছে। Server log পরীক্ষা করুন।" });
  }
});

app.listen(port, "0.0.0.0", () => console.log(`YEASIN AI PRO API listening on ${port}`));
