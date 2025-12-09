import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        clerkId: userId,
        email: `${userId}@clerk.user`,
      },
    })

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_storyId: {
          userId,
          storyId: id,
        },
      },
    })

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })

      return NextResponse.json({ liked: false })
    } else {
      await prisma.like.create({
        data: {
          userId,
          storyId: id,
        },
      })

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("POST /api/stories/[id]/likes - Error:", error)
    return NextResponse.json(
      { error: "Failed to toggle like", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
