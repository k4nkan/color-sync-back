import { VercelRequest, VercelResponse } from "@vercel/node";
import cors from "cors";

const { gemini } = require("@google/generative-ai");
const genAI = new gemini(process.env.GEMINI_API_KEY);
const model = genAI.gemini({ model: "gemini-1.5-flash" });

const corsHandler = cors({
  origin: "*",
});

export default async function (req: VercelRequest, res: VercelResponse) {
  corsHandler(req, res, async () => {
    const { name = "world" } = req.query;

    try {
      const prompt = "hello";
      const result = await model.generateContent(prompt);
      console.log(result.response.text());
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).send("Error generating content");
    }

    res.send(`hello ${name}!`);
  });
}
