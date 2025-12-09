import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get("teamId")

    const clerkUser = await currentUser()
    if (clerkUser) {
      await prisma.user.upsert({
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
    }

    const stories = await prisma.story.findMany({
      where: teamId ? { teamId } : {},
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(stories)
  } catch (error) {
    console.error("GET /api/stories - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch stories",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, content, teamId, storytellingId } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const clerkUser = await currentUser()

    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        name:
          clerkUser?.firstName && clerkUser?.lastName
            ? `${clerkUser.firstName} ${clerkUser.lastName}`
            : clerkUser?.firstName || clerkUser?.emailAddresses[0]?.emailAddress || userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress || `${userId}@clerk.user`,
      },
    })

    let finalTeamId = teamId
    let finalStorytellingId = storytellingId

    if (!finalTeamId) {
      const userTeam = await prisma.team.findFirst({
        where: { ownerId: userId },
      })

      if (!userTeam) {
        return NextResponse.json({ error: "No team found. Please create a team first." }, { status: 400 })
      }

      finalTeamId = userTeam.id
    }

    if (!finalStorytellingId) {
      let storytelling = await prisma.storytelling.findFirst({
        where: { teamId: finalTeamId },
      })

      if (!storytelling) {
        storytelling = await prisma.storytelling.create({
          data: {
            title: "Default Storytelling",
            ownerId: userId,
            teamId: finalTeamId,
          },
        })
      }

      finalStorytellingId = storytelling.id
    }

    const story = await prisma.story.create({
      data: {
        title,
        content,
        authorId: userId,
        teamId: finalTeamId,
        storytellingId: finalStorytellingId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    return NextResponse.json(story, { status: 201 })
  } catch (error) {
    console.error("POST /api/stories - Error:", error)
    return NextResponse.json(
      {
        error: "Failed to create story",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
