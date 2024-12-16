import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);
  const { searchParams } = new URL(request.url);
  const storytellingId = searchParams.get("storytellingId");

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const stories = await prisma.story.findMany({
      where: {
        storytellingId: storytellingId ?? undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: true,
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        storytelling: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const storiesWithLikeInfo = stories.map((story: any) => ({
      ...story,
      likes: story.likes.length,
      isLikedByUser: story.likes.some((like: any) => like.userId === userId),
    }));

    return NextResponse.json(storiesWithLikeInfo);
  } catch (error) {
    console.error("[STORIES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { title, content, storytellingId } = await request.json();

    if (!title || !content || !storytellingId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const storytelling = await prisma.storytelling.findUnique({
      where: { id: storytellingId },
      include: { team: true },
    });

    if (!storytelling) {
      return new NextResponse("Storytelling not found", { status: 404 });
    }

    const story = await prisma.story.create({
      data: {
        title,
        content,
        authorId: userId,
        storytellingId,
        teamId: storytelling.teamId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        },
        likes: true,
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        storytelling: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...story,
      likes: 0,
      isLikedByUser: false,
    });
  } catch (error) {
    console.error("[STORIES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
