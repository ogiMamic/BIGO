import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const storytellings = await prisma.storytelling.findMany({
      where: {
        userId: userId,
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

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title } = await req.json();

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const storytelling = await prisma.storytelling.create({
      data: {
        title,
        userId,
      },
    });

    return NextResponse.json(storytelling);
  } catch (error) {
    console.error("Error in POST /api/storytellings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
