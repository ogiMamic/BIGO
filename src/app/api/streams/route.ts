import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // For now, return mock data until we add Stream model to schema
    const streams = [
      { id: 1, name: "Marketing", stories: [] },
      { id: 2, name: "Product Development", stories: [] },
      { id: 3, name: "Customer Support", stories: [] },
    ]

    return NextResponse.json(streams)
  } catch (error) {
    console.error("[v0] Error fetching streams:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await req.json()

    // Mock response until we add Stream model
    const newStream = {
      id: Date.now(),
      name,
      stories: [],
    }

    return NextResponse.json(newStream)
  } catch (error) {
    console.error("[v0] Error creating stream:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
