import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUserWithOrg } from "@/lib/organization"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: teamId } = await params
    const currentUser = await getCurrentUserWithOrg()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if team exists and is in same organization
    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        organizationId: currentUser.organizationId,
      },
    })

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    // Add user to team members
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
    console.error("[v0] POST /api/teams/[id]/join - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to join team",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
