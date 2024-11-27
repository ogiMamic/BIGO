import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  const { id, commentId } = req.query;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "DELETE") {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id: commentId as string },
        include: { author: true },
      });

      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      if (comment.author.id !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      await prisma.comment.delete({
        where: { id: commentId as string },
      });

      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ error: "Error deleting comment" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
