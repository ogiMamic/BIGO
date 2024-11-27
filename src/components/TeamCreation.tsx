"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface TeamCreationProps {
  onTeamCreated: (teamId: string) => void;
}

export default function TeamCreation({ onTeamCreated }: TeamCreationProps) {
  const [teamName, setTeamName] = useState("");
  const { user } = useUser();

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !user) {
      toast.error("Please enter a team name and ensure you're logged in.");
      return;
    }

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: teamName }),
      });

      if (response.ok) {
        const team = await response.json();
        toast.success("Team created successfully!");
        onTeamCreated(team.id);
        setTeamName("");
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to create team");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error(
        `Failed to create team: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  return (
    <form onSubmit={handleCreateTeam} className="space-y-4">
      <div>
        <label
          htmlFor="teamName"
          className="block text-sm font-medium text-gray-300"
        >
          Team Name
        </label>
        <Input
          type="text"
          id="teamName"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name"
          className="mt-1 block w-full bg-gray-700 text-white"
        />
      </div>
      <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
        Create Team
      </Button>
    </form>
  );
}
