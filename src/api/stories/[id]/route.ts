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

      res.status(201).json(comment);
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ error: "Error adding comment" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
