import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const storytellingId = searchParams.get("storytellingId");

    if (!storytellingId) {
      return new NextResponse("Storytelling ID is required", { status: 400 });
    }

    const stories = await prisma.story.findMany({
      where: {
        storytellingId,
        userId,
      },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error in GET /api/stories:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, content, storytellingId } = await req.json();

    if (!title || !content || !storytellingId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const story = await prisma.story.create({
      data: {
        title,
        content,
        storytellingId,
        userId,
        authorId: userId,
      },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error("Error in POST /api/stories:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
