import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/organization"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: teamId } = await params
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
      },
    })

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    await prisma.team.update({
      where: { id: teamId },
      data: {
        members: {
          connect: { id: currentUser.id },
        },
      },
    })

    return NextResponse.json({ success: true, team })
  } catch (error) {
    console.error("POST /api/teams/[id]/join - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to join team",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
