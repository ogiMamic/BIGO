import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
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
          clerkId: userId,
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

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        name:
          clerkUser.firstName && clerkUser.lastName
            ? `${clerkUser.firstName} ${clerkUser.lastName}`
            : clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress || userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || `${userId}@clerk.user`,
      },
      create: {
        clerkId: userId,
        name:
          clerkUser.firstName && clerkUser.lastName
            ? `${clerkUser.firstName} ${clerkUser.lastName}`
            : clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress || userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || `${userId}@clerk.user`,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("POST /api/users - Error:", error)
    return NextResponse.json(
      { error: "Failed to sync user data", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
