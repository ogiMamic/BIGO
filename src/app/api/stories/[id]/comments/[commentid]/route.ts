import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(req: Request, { params }: { params: { id: string; commentId: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    if (comment.authorId !== userId) {
      return NextResponse.json({ error: "Forbidden - Only author can delete" }, { status: 403 })
    }

    await prisma.comment.delete({
      where: { id: params.commentId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] DELETE /api/stories/[id]/comments/[commentId] - Error:", error)
    return NextResponse.json(
      { error: "Failed to delete comment", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
