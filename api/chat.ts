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
    // color setup
    const { theme = "random", number = "3", density = "50" } = req.query;

    // プロンプトの設定
    const prompt = `What are the ${number} color codes associated with ${theme}? Color intensity should be 50(min:0,max:50). Your answer should be the color code only and please sequence the colour codes from closest to black to closest to white. Add the hashtag at the beginning of each color code and delimit with a comma`;

    try {
      const result = await model.generateContent(prompt);
      res.status(200).send(result.response.text());
    } catch (error) {
      console.error("error generating content:", error);
      if (error.response && error.response.status) {
        res
          .status(error.response.status)
          .send({ error: "API Error", details: error.response.data });
      } else {
        res.status(500).send({
          error: "Internal Server Error",
          message: "An unexpected error occurred.",
        });
      }
    }
  });
}
