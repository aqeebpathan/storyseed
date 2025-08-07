import { auth } from "@/app/auth"
import { NextResponse } from "next/server"
import { Story } from "@/models/Story"
import { User } from "@/models/User"
import { ObjectId } from "mongodb"
import { connectDB } from "@/lib/mongodb"

// AI scoring function
async function evaluateLine(text: string, context: string): Promise<number> {
  const prompt = `
Given the story context and the new line, rate how well the new line fits on a scale from 0 to 10.
Context: "${context}"
Line: "${text}"
Only respond with an integer.
  `

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemma-3n-e4b-it:free",
      messages: [{ role: "user", content: prompt }],
      provider: {
        sort: "latency",
      },
    }),
  })

  const json = await res.json()
  console.log(json)
  const raw = json.choices?.[0]?.message?.content || "1"
  const num = parseInt(raw.match(/\d+/)?.[0] || "1", 10)

  return Math.min(Math.max(num, 1), 10)
}

export const POST = auth(async function POST(req, ctx) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  const params = await ctx.params
  const slug = params.slug

  let text: string
  try {
    const body = await req.json()
    text = body.text
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!text || text.length > 150) {
    return NextResponse.json({ error: "Invalid line input" }, { status: 400 })
  }

  try {
    await connectDB()

    const story = await Story.findOne({ slug })
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 })
    }

    const context = story.lines.map((line: any) => line.text).join(" ")
    const score = await evaluateLine(text, context)

    const userId = new ObjectId(req.auth.user.id)
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const newLine = {
      text,
      createdBy: user._id,
      score,
      createdAt: new Date(),
    }

    story.lines.push(newLine)
    await story.save()

    user.points += score
    await user.save()

    return NextResponse.json({ success: true, score, line: newLine })
  } catch (error) {
    console.error("[POST /stories/:slug/lines] Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
})
