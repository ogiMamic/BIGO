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
        ownerId: currentUser.id,
      },
    })

    return NextResponse.json(teams)
  } catch (error) {
    console.error("GET /api/teams - Error:", error)
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
    const currentUser = await getCurrentUserWithOrg()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name } = body

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid request: name is required" }, { status: 400 })
    }

    const team = await prisma.team.create({
      data: {
        name,
        ownerId: currentUser.id,
        organizationId: currentUser.organizationId,
      },
    })

    return NextResponse.json(team)
  } catch (error) {
    console.error("POST /api/teams - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to create team",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
