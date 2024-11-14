import { VercelRequest, VercelResponse } from "@vercel/node";
const { GoogleGenerativeAI } = require("@google/generative-ai");
import cors from "cors";

// corsの設定
const corsHandler = cors({
  origin: "*", // 任意のオリジンからリクエストを許可
});

// gemini apiの初期設定
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORSハンドラの適用
  corsHandler(req, res, async () => {
    const { name = "world" } = req.query;

    const prompt = `What are the three color codes associated with ${name}? Your answer should be the color code only.`;

    try {
      const result = await model.generateContent(prompt);
      res.send(result.response.text());
    } catch (error) {
      res.send(error);
    }
  });
}
