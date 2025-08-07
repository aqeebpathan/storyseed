import { auth } from "@/app/auth"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import { NextResponse } from "next/server"

export const GET = auth(async function GET(req) {
  if (!req.auth || !req.auth.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    await connectDB()

    const user = await User.findById(req.auth.user.id).select(
      "name email image points",
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (err) {
    console.error("[GET /api/me] Error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
})
