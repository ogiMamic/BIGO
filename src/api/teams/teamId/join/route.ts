import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { teamId } = params;

    const existingMembership = await prisma.teamMember.findFirst({
      where: {
        userId: userId,
        teamId: teamId,
      },
    });

    if (existingMembership) {
      return new NextResponse("User is already a member of this team", {
        status: 400,
      });
    }

    await prisma.teamMember.create({
      data: {
        userId: userId,
        teamId: teamId,
        role: "MEMBER",
      },
    });

    return new NextResponse("Successfully joined the team", { status: 200 });
  } catch (error) {
    console.error("Error joining team:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
