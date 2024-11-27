import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  const { id } = req.query;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    try {
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Comment content is required" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const comment = await prisma.comment.create({
        data: {
          content,
          author: { connect: { id: userId } },
          story: { connect: { id: id as string } },
        },
        include: {
          author: {
            select: { id: true, name: true },
          },
        },
      });

      res.status(201).json({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        author: {
          id: user.id,
          name: user.name,
        },
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ error: "Error creating comment" });
    }
  } else if (req.method === "GET") {
    try {
      const comments = await prisma.comment.findMany({
        where: { storyId: id as string },
        include: {
          author: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Error fetching comments" });
    }
  } else {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
