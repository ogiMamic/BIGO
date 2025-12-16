import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/organization"

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get("teamId")

    const stories = await prisma.story.findMany({
      where: {
        ...(teamId ? { teamId } : {}),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
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
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, content, teamId, storytellingId } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    let finalTeamId = teamId
    let finalStorytellingId = storytellingId

    if (!finalTeamId) {
      const userTeam = await prisma.team.findFirst({
        where: {
          OR: [{ ownerId: currentUser.id }, { members: { some: { id: currentUser.id } } }],
        },
      })

      if (!userTeam) {
        return NextResponse.json({ error: "No team found. Please create a team first." }, { status: 400 })
      }

      finalTeamId = userTeam.id
    }

    if (!finalStorytellingId) {
      let storytelling = await prisma.storytelling.findFirst({
        where: {
          teamId: finalTeamId,
        },
      })

      if (!storytelling) {
        storytelling = await prisma.storytelling.create({
          data: {
            title: "Default Storytelling",
            ownerId: currentUser.id,
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
        authorId: currentUser.id,
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
        team: {
          select: {
            id: true,
            name: true,
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
