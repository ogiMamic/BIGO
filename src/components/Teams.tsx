"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const initialTeams = [
  {
    id: 1,
    name: "Marketing",
    members: ["John Doe", "Jane Smith", "Bob Johnson"],
  },
  {
    id: 2,
    name: "Development",
    members: ["Alice Brown", "Charlie Davis", "Eva Wilson"],
  },
  {
    id: 3,
    name: "Sales",
    members: ["Frank Miller", "Grace Lee", "Henry Taylor"],
  },
];

export default function Teams() {
  const [teams, setTeams] = useState(initialTeams);
  const [newTeam, setNewTeam] = useState({ name: "", members: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateTeam = () => {
    if (newTeam.name.trim()) {
      const newTeamObj = {
        id: teams.length + 1,
        name: newTeam.name,
        members: newTeam.members.split(",").map((member) => member.trim()),
      };
      setTeams([...teams, newTeamObj]);
      setNewTeam({ name: "", members: "" });
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="p-4 bg-gray-800 rounded-b-2xl shadow-md">
        <h1 className="text-2xl font-bold text-green-500">TEAMS</h1>
      </header>
      <div className="flex-1 overflow-hidden flex flex-col p-4">
        <div className="flex justify-end mb-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4">
                Create New Team
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white">
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input
                    id="team-name"
                    value={newTeam.name}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, name: e.target.value })
                    }
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="team-members">
                    Team Members (comma-separated)
                  </Label>
                  <Input
                    id="team-members"
                    value={newTeam.members}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, members: e.target.value })
                    }
                    className="bg-gray-700 text-white"
                  />
                </div>
                <Button onClick={handleCreateTeam} className="w-full">
                  Create Team
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <Card
                key={team.id}
                className="bg-gray-800 border-gray-700 rounded-2xl shadow-md"
              >
                <CardHeader>
                  <CardTitle className="text-green-500">{team.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {team.members.map((member, index) => (
                      <Avatar key={index} className="w-8 h-8">
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${member}`}
                        />
                        <AvatarFallback>{member[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
