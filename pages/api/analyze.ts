import type { NextApiRequest, NextApiResponse } from "next";

const HF_ACCESS_TOKEN = process.env.HF_ACCESS_TOKEN!;
const HF_API_URL = "https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { text } = req.body;

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(500).json({ message: "API Error", error });
    }

    const result = await response.json();
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
}
