import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; commentid: string }> }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { commentid } = await params

    const comment = await prisma.comment.findUnique({
      where: { id: commentid },
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    if (comment.authorId !== userId) {
      return NextResponse.json({ error: "Forbidden - Only author can delete" }, { status: 403 })
    }

    await prisma.comment.delete({
      where: { id: commentid },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/stories/[id]/comments/[commentid] - Error:", error)
    return NextResponse.json(
      { error: "Failed to delete comment", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
