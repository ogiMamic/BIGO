"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface InitialTeamSetupProps {
  onTeamCreated: () => void;
}

export default function InitialTeamSetup({
  onTeamCreated,
}: InitialTeamSetupProps) {
  const [teamName, setTeamName] = useState("");

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim()) {
      try {
        const response = await fetch("/api/teams", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: teamName }),
        });

        if (!response.ok) {
          throw new Error("Failed to create team");
        }

        toast.success("Team created successfully!");
        onTeamCreated();
      } catch (error) {
        console.error("Error creating team:", error);
        toast.error("Failed to create team. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Create Your Team</h2>
      <form onSubmit={handleCreateTeam} className="space-y-4">
        <Input
          type="text"
          placeholder="Enter team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          Create Team
        </Button>
      </form>
    </div>
  );
}
