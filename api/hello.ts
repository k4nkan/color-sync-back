import { VercelRequest, VercelResponse } from "@vercel/node";

export default function (req: VercelRequest, res: VercelResponse) {
  const { name = "world" } = req.query;
  res.send(`hello ${name}!`);
}
