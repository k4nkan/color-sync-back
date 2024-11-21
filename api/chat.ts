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
    const prompt = `
    Generate ${number} color codes associated with the theme '${theme}'.
    The intensity of the colors should be ${density} (min: 0, max: 100).
    Return the colors as a plain text in the following format:
    "red1,green1,blue1;red2,green2,blue2;red3,green3,blue3".
    Do not include any additional text or explanation.
    `;

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
