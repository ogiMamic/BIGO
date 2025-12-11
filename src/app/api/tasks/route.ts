import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUserWithOrg } from "@/lib/organization"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const storyId = searchParams.get("storyId")

    const tasks = await prisma.task.findMany({
      where: storyId ? { storyId } : { assigneeId: userId },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        story: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("[v0] GET /api/tasks - Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch tasks", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { title, description, status, storyId, assigneeId } = body

    if (!title || !storyId) {
      return NextResponse.json({ error: "Title and storyId are required" }, { status: 400 })
    }

    await getCurrentUserWithOrg(userId)

    const task = await prisma.task.create({
      data: {
        title,
        description: description || "",
        status: status || "To Do",
        assigneeId: assigneeId || userId,
        storyId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("POST /api/tasks - Error:", error)
    return NextResponse.json(
      { error: "Failed to create task", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { id, title, description, status, assigneeId } = body

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(assigneeId && { assigneeId }),
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("[v0] PATCH /api/tasks - Error:", error)
    return NextResponse.json(
      { error: "Failed to update task", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
