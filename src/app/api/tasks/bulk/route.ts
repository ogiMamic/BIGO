import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function PUT(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { tasks } = await req.json()

    // Mock auto-save endpoint - in production this would update database

    return NextResponse.json({ success: true, savedCount: tasks.length })
  } catch (error) {
    console.error("Error auto-saving tasks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
