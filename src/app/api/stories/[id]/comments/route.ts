import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const comments = await prisma.comment.findMany({
      where: { storyId: params.id },
      include: {
        author: {
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

    return NextResponse.json(comments)
  } catch (error) {
    console.error("[v0] GET /api/stories/[id]/comments - Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { content } = body

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
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

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        storyId: params.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("[v0] POST /api/stories/[id]/comments - Error:", error)
    return NextResponse.json(
      { error: "Failed to create comment", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
