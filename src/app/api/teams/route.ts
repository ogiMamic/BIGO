import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find teams where the user is the owner
    const teams = await prisma.team.findMany({
      where: {
        ownerId: user.id,
      },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid request: name is required and must be a string" },
        { status: 400 }
      );
    }

    console.log("Creating team with name:", name, "for user:", user.id);

    // Create a team with the current user as owner only
    const team = await prisma.team.create({
      data: {
        name,
        ownerId: user.id,
      },
    });

    console.log("Team created successfully:", team);
    return NextResponse.json(team);
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      {
        error: "Failed to create team",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
