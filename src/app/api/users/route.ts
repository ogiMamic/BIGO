import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: userId,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
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
