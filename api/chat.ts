import { VercelRequest, VercelResponse } from "@vercel/node";
import cors from "cors";

const { gemini } = require("@google/generative-ai");
const genAI = new gemini(process.env.GEMINI_API_KEY); // 環境変数の確認
const model = genAI.gemini({ model: "gemini-1.5-flash" });

const corsHandler = cors({
  origin: "*", // 任意のオリジンからリクエストを許可
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORSハンドラの適用
  corsHandler(req, res, async () => {
    const { name = "world" } = req.query;

    try {
      // Google Generative AIを使ってプロンプトから生成したコンテンツを取得
      const prompt = `hello ${name}`;
      const result = await model.generateContent(prompt);
      const generatedText = result.response.text();
      console.log(generatedText);

      // 生成したテキストをレスポンスとして返す
      res.status(200).send(`Generated Text: ${generatedText}`);
    } catch (error) {
      // エラーハンドリング
      console.error("Error generating content:", error);
      res.status(500).send("Error generating content");
    }
  });
}
