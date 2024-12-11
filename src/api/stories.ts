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
    const { stream } = req.query;
    try {
      const stories = await prisma.story.findMany({
        where: stream !== "Alle" ? { stream: stream as string } : {},
        include: {
          author: {
            select: { name: true },
          },
          team: {
            select: { name: true },
          },
          comments: {
            include: {
              author: {
                select: { name: true },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      res.status(200).json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ error: "Error fetching stories" });
    }
  } else if (req.method === "POST") {
    const { title, content, stream } = req.body;
    try {
      const story = await prisma.story.create({
        data: {
          title,
          content,
          stream,
          author: { connect: { id: userId } },
          team: { connect: { id: "default_team_id" } }, // Replace with actual team selection logic
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
      res.status(201).json(story);
    } catch (error) {
      console.error("Error creating story:", error);
      res.status(500).json({ error: "Error creating story" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
