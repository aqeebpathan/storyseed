import { connectDB } from "@/lib/mongodb"
import { Story } from "@/models/Story"
import { NextResponse } from "next/server"

type Params = {
  params: {
    slug: string
  }
}

export async function GET(_req: Request, { params }: Params) {
  try {
    await connectDB()

    const storySlug = params.slug

    const story = await Story.findOne({ slug: storySlug })
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
