import { auth } from "@/app/auth"
import { NextResponse } from "next/server"
import { Story } from "@/models/Story"
import { User } from "@/models/User"
import { ObjectId } from "mongodb"
import { connectDB } from "@/lib/mongodb"

type StoryLine = {
  text: string
}

// AI scoring function
async function evaluateLine(
  text: string,
  context: string,
): Promise<{ score: number; formattedText: string }> {
  const prompt = `
You are evaluating how well a new line fits into an existing story.

You must do two things:

1. Score the new line from 0 to 10 **based strictly on how well it continues the story**. A score of:
   - 10 means it fits perfectly, naturally extending the story.
   - 5 means it's neutral or weakly related.
   - 0 means it’s unrelated, random, or breaks the story's logic or tone.

2. Format the line by capitalizing the first letter and adding a period if missing. Do **not** change the wording.

Here is the context so far:
"${context}"

Here is the new line to evaluate:
"${text}"

Respond in this exact format:

Score: <number from 0 to 10>
Formatted Line: <formatted version of the line>
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
  const raw = json.choices?.[0]?.message?.content || ""

  const score = parseInt(raw.match(/Score:\s*(\d+)/)?.[1] || "1", 10)
  const formattedText = raw.match(/Formatted Line:\s*(.+)/)?.[1]?.trim() || text

  return {
    score: Math.min(Math.max(score, 1), 10),
    formattedText,
  }
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

    const context = story.lines.map((line: StoryLine) => line.text).join(" ")

    const userId = req.auth?.user?.id ? new ObjectId(req.auth.user.id) : null
    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { score, formattedText } = await evaluateLine(text, context)

    const newLine = {
      text: formattedText,
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
