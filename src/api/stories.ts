import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const { teamId } = req.query;

    if (!teamId) {
      return res.status(400).json({ error: "Team ID is required" });
    }

    try {
      const stories = await prisma.story.findMany({
        where: {
          teamId: teamId as string,
        },
        include: {
          author: {
            select: { name: true },
          },
          team: {
            select: { name: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      return res.status(500).json({ error: "Error fetching stories" });
    }
  } else if (req.method === "POST") {
    const { title, content, teamId } = req.body;

    if (!title || !content || !teamId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const story = await prisma.story.create({
        data: {
          title,
          content,
          authorId: userId,
          teamId,
        },
        include: {
          author: {
            select: { name: true },
          },
          team: {
            select: { name: true },
          },
        },
      });

      return res.status(201).json(story);
    } catch (error) {
      console.error("Error creating story:", error);
      return res.status(500).json({ error: "Error creating story" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
