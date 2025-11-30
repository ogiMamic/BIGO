import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const teams = await prisma.team.findMany({
      where: {
        ownerId: userId,
      },
    })

    return NextResponse.json(teams)
  } catch (error) {
    console.error("[v0] GET /api/teams - Error:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name } = body

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid request: name is required" }, { status: 400 })
    }

    const team = await prisma.team.create({
      data: {
        name,
        ownerId: userId,
      },
    })

    return NextResponse.json(team)
  } catch (error) {
    console.error("[v0] POST /api/teams - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to create team",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
