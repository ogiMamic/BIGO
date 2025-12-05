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
    const recipientId = searchParams.get("recipientId")

    if (!recipientId) {
      return NextResponse.json({ error: "Recipient ID required" }, { status: 400 })
    }

    const messages = await prisma.directMessage.findMany({
      where: {
        OR: [
          { senderId: userId, recipientId },
          { senderId: recipientId, recipientId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipient: {
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
    console.error("[v0] GET /api/messages/direct - Error:", error)
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
    const { content, recipientId } = body

    if (!content || !recipientId) {
      return NextResponse.json({ error: "Content and recipientId are required" }, { status: 400 })
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        clerkId: userId,
        email: `${userId}@clerk.user`,
      },
    })

    const message = await prisma.directMessage.create({
      data: {
        content,
        senderId: userId,
        recipientId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipient: {
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
    console.error("[v0] POST /api/messages/direct - Error:", error)
    return NextResponse.json(
      { error: "Failed to send message", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
