import { connectDB } from "@/lib/mongodb"
import { Story } from "@/models/Story"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const slug = req.nextUrl.pathname.split("/").at(-1)

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 })
    }

    const story = await Story.findOne({ slug })
      .populate("createdBy", "name email image")
      .populate("lines.createdBy", "name image")

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 })
    }

    return NextResponse.json(story)
  } catch (error) {
    console.error("[GET /api/stories/:slug] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
