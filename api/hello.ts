import { VercelRequest, VercelResponse } from "@vercel/node";
import cors from "cors";

const corsHandler = cors({
  origin: "*",
});

export default function (req: VercelRequest, res: VercelResponse) {
  corsHandler(req, res, () => {
    const { name = "world" } = req.query;
    res.send(`hello ${name}!`);
  });
}
