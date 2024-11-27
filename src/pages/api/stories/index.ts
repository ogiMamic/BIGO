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
    try {
      const { storytellingId } = req.query;

      if (!storytellingId || typeof storytellingId !== "string") {
        return res.status(400).json({ error: "Storytelling ID is required" });
      }

      const stories = await prisma.story.findMany({
        where: {
          storytellingId: storytellingId,
          storytelling: {
            OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
          },
        },
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
          likes: {
            where: {
              userId: userId,
            },
          },
        },
      });

      const storiesWithLikeInfo = stories.map((story) => ({
        ...story,
        likes: story.likes.length,
        isLikedByUser: story.likes.length > 0,
      }));

      res.status(200).json(storiesWithLikeInfo);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ error: "Error fetching stories" });
    }
  } else if (req.method === "POST") {
    try {
      const { title, content, storytellingId } = req.body;

      if (!title || !content || !storytellingId) {
        return res
          .status(400)
          .json({ error: "Title, content, and storytellingId are required" });
      }

      const newStory = await prisma.story.create({
        data: {
          title,
          content,
          author: { connect: { id: userId } },
          storytelling: { connect: { id: storytellingId } },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          comments: true,
        },
      });

      res.status(201).json({
        ...newStory,
        likes: 0,
        isLikedByUser: false,
      });
    } catch (error) {
      console.error("Error creating story:", error);
      res.status(500).json({ error: "Error creating story" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
