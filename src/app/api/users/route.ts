import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/organization"

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      where: {
        NOT: {
          clerkId: currentUser.clerkId,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        teams: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("GET /api/users - Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch users", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(currentUser)
  } catch (error) {
    console.error("POST /api/users - Error:", error)
    return NextResponse.json(
      { error: "Failed to sync user data", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
