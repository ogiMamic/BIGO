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

  if (req.method === "POST") {
    const { title, description, storyId } = req.body;
    try {
      const task = await prisma.task.create({
        data: {
          title,
          description,
          status: "TODO",
          assignee: { connect: { id: userId } },
          story: { connect: { id: storyId } },
        },
        include: {
          assignee: {
            select: { name: true },
          },
          story: {
            select: { title: true },
          },
        },
      });
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Error creating task" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
