import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUserWithOrg } from "@/lib/organization"

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUserWithOrg()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teams = await prisma.team.findMany({
      where: {
        organizationId: currentUser.organizationId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    })

    return NextResponse.json(teams)
  } catch (error) {
    console.error("[v0] GET /api/teams - Error:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    console.log("[v0] POST /api/teams - Starting team creation")

    const currentUser = await getCurrentUserWithOrg()
    console.log(
      "[v0] Current user:",
      currentUser ? { id: currentUser.id, organizationId: currentUser.organizationId } : "null",
    )

    if (!currentUser) {
      console.error("[v0] No current user found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    console.log("[v0] Request body:", body)

    const { name } = body

    if (!name || typeof name !== "string") {
      console.error("[v0] Invalid team name:", name)
      return NextResponse.json({ error: "Invalid request: name is required" }, { status: 400 })
    }

    console.log("[v0] Creating team with data:", {
      name,
      ownerId: currentUser.id,
      organizationId: currentUser.organizationId,
    })

    const team = await prisma.team.create({
      data: {
        name,
        ownerId: currentUser.id,
        organizationId: currentUser.organizationId,
      },
    })

    console.log("[v0] Team created successfully:", team.id)
    return NextResponse.json(team)
  } catch (error) {
    console.error("[v0] POST /api/teams - Error:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      {
        error: "Failed to create team",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
