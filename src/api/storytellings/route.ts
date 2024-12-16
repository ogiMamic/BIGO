import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const storytellings = await prisma.storytelling.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(storytellings);
  } catch (error) {
    console.error("Error in GET /api/storytellings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { title, teamId } = await request.json();

    if (!title || !teamId) {
      return new NextResponse("Title and teamId are required", { status: 400 });
    }

    const storytelling = await prisma.storytelling.create({
      data: {
        title,
        ownerId: userId,
        teamId,
        members: {
          connect: { id: userId },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(storytelling);
  } catch (error) {
    console.error("Error in POST /api/storytellings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
