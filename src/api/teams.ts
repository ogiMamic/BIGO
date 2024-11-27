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
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Team name is required" });
      }

      const team = await prisma.team.create({
        data: {
          name,
          owner: { connect: { id: userId } },
          members: { connect: { id: userId } },
        },
      });

      res.status(201).json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      res.status(500).json({ error: "Error creating team" });
    }
  } else if (req.method === "GET") {
    try {
      const teams = await prisma.team.findMany({
        where: {
          members: { some: { id: userId } },
        },
      });

      res.status(200).json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ error: "Error fetching teams" });
    }
  } else {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
