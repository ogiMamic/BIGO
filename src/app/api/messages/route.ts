import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get("teamId")

    if (!teamId) {
      return NextResponse.json({ error: "Team ID required" }, { status: 400 })
    }

    const messages = await prisma.message.findMany({
      where: { teamId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("[v0] GET /api/messages - Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages", details: error instanceof Error ? error.message : String(error) },
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
    const { content, teamId } = body

    if (!content || !teamId) {
      return NextResponse.json({ error: "Content and teamId are required" }, { status: 400 })
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@clerk.user`,
      },
    })

    const message = await prisma.message.create({
      data: {
        content,
        senderId: userId,
        teamId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error("[v0] POST /api/messages - Error:", error)
    return NextResponse.json(
      { error: "Failed to create message", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
