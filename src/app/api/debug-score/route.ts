import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { text, context } = await req.json()

  const prompt = `
Rate how well the following new line fits with the given story context on a scale of 1 to 10.
Respond with a single integer only.

Context: "${context}"

Line: "${text}"

Score (1 = very poor, 10 = excellent):
`

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [{ role: "user", content: prompt }],
    }),
  })

  const json = await res.json()
  console.log(json)
  const raw = json.choices?.[0]?.message?.content || "1"
  const num = parseInt(raw.match(/\d+/)?.[0] || "1", 10)

  return NextResponse.json({ score: Math.min(Math.max(num, 1), 10) })
}
