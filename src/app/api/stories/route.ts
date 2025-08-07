import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Story } from "@/models/Story"
import { User } from "@/models/User"
import { auth } from "@/app/auth"

// Fetch 4 random stories
export async function GET() {
  try {
    await connectDB()

    const stories = await Story.aggregate([
      { $sample: { size: 4 } },
      {
        $project: {
          title: 1,
          genre: 1,
          createdAt: 1,
          lines: { $slice: ["$lines", 1] }, // get only first line
          slug: 1,
        },
      },
    ])

    return NextResponse.json(stories)
  } catch (err) {
    console.error("[GET /api/stories] Error:", err)
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}

// Create a new story with the first line
export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  try {
    await connectDB()

    const { title, genre, firstLine } = await req.json()

    if (!title || !firstLine || firstLine.length > 150) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const userEmail = req.auth.user?.email
    const user = await User.findOne({ email: userEmail })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const newStory = await Story.create({
      title,
      genre,
      createdBy: user._id,
      lines: [
        {
          text: firstLine,
          createdBy: user._id,
          score: 0,
        },
      ],
    })

    return NextResponse.json(newStory, { status: 201 })
  } catch (error) {
    console.error("[POST /api/stories] Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
})
