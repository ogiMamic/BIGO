import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the story
    const story = await prisma.story.findUnique({
      where: { id: params.id },
      include: { author: true },
    })

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 })
    }

    if (story.authorId !== userId) {
      return NextResponse.json({ error: "Forbidden - Only author can delete" }, { status: 403 })
    }

    // Delete the story (cascade will delete likes and comments)
    await prisma.story.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Story deleted successfully" })
  } catch (error) {
    console.error("Error deleting story:", error)
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 })
  }
}
