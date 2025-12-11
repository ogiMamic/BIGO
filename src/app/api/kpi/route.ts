import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUserWithOrg } from "@/lib/organization"

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUserWithOrg()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userTeams = await prisma.team.findMany({
      where: {
        organizationId: currentUser.organizationId,
        OR: [{ ownerId: currentUser.id }, { members: { some: { id: currentUser.id } } }],
      },
      include: {
        members: true,
        stories: true,
        messages: true,
      },
    })

    const teamIds = userTeams.map((team) => team.id)

    const tasksCompleted = await prisma.task.count({
      where: {
        story: {
          teamId: { in: teamIds },
          organizationId: currentUser.organizationId,
        },
        status: "Completed",
      },
    })

    const totalTasks = await prisma.task.count({
      where: {
        story: {
          teamId: { in: teamIds },
          organizationId: currentUser.organizationId,
        },
      },
    })

    const messagesCount = await prisma.message.count({
      where: {
        organizationId: currentUser.organizationId,
        teamId: { in: teamIds },
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    })

    const storiesCount = await prisma.story.count({
      where: {
        organizationId: currentUser.organizationId,
        teamId: { in: teamIds },
      },
    })

    const activeUsers = userTeams.reduce((acc, team) => acc + team.members.length, 0)

    const kpiData = {
      activeUsers,
      tasksCompleted,
      messagesExchanged: messagesCount,
      storiesShared: storiesCount,
      teamGrowth: 12,
      taskCompletionRate: totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0,
    }

    return NextResponse.json(kpiData)
  } catch (error) {
    console.error("GET /api/kpi - Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch KPI data", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
