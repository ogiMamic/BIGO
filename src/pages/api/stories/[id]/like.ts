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
      // Check if the user has already liked the story
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_storyId: {
            userId: userId,
            storyId: id as string,
          },
        },
      });

      let like;
      if (existingLike) {
        // If the like exists, remove it (unlike)
        await prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        });
        like = null;
      } else {
        // If the like doesn't exist, create it
        like = await prisma.like.create({
          data: {
            user: { connect: { id: userId } },
            story: { connect: { id: id as string } },
          },
        });
      }

      const likeCount = await prisma.like.count({
        where: { storyId: id as string },
      });

      return res.status(200).json({ like, likeCount });
    } catch (error) {
      console.error("Error handling like:", error);
      return res.status(500).json({ error: "Error handling like" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
