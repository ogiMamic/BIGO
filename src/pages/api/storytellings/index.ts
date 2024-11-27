import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

// Create a single PrismaClient instance and reuse it
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Ensure user exists in the database
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: "User", // You might want to get this from Clerk
        email: "user@example.com", // You might want to get this from Clerk
      },
    });

    if (req.method === "GET") {
      const storytellings = await prisma.storytelling.findMany({
        where: {
          OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      });

      return res.status(200).json(storytellings);
    } else if (req.method === "POST") {
      const { title } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const newStorytelling = await prisma.storytelling.create({
        data: {
          title,
          owner: { connect: { id: userId } },
          members: { connect: { id: userId } },
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      });

      return res.status(201).json(newStorytelling);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
