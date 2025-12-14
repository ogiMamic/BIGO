"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TeamMember {
  id: string
  name: string | null
  email: string
}

interface Team {
  id: string
  name: string
  owner: TeamMember
  members: TeamMember[]
  _count: {
    members: number
    stories: number
    messages: number
  }
}

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/teams")
      if (!response.ok) throw new Error("Failed to fetch teams")
      const data = await response.json()
      setTeams(data)
    } catch (error) {
      console.error("Error fetching teams:", error)
      toast({
        title: "Error",
        description: "Failed to load teams. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return email.slice(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground mt-1">Manage your teams and collaborate with members</p>
        </div>
        <Button
          onClick={() => {
            // Navigate to team creation (handled by InitialTeamSetup)
            window.location.href = "/dashboard"
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Team
        </Button>
      </div>

      {teams.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No teams yet</h3>
            <p className="text-muted-foreground text-center mb-4">Create your first team to start collaborating</p>
            <Button
              onClick={() => {
                window.location.href = "/dashboard"
              }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Your First Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card key={team.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{team.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Owner: {team.owner.name || team.owner.email}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{team._count.members}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Team members */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Members</h4>
                      <div className="flex flex-wrap gap-2">
                        {team.members.length > 0 ? (
                          team.members.slice(0, 8).map((member) => (
                            <div key={member.id} className="group relative">
                              <Avatar className="w-9 h-9 border-2 border-background">
                                <AvatarFallback className="text-xs">
                                  {getInitials(member.name, member.email)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-md border">
                                {member.name || member.email}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No members yet</p>
                        )}
                        {team.members.length > 8 && (
                          <Avatar className="w-9 h-9 border-2 border-background">
                            <AvatarFallback className="text-xs">+{team.members.length - 8}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>

                    {/* Team stats */}
                    <div className="flex gap-4 pt-4 border-t text-sm">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Stories</span>
                        <span className="font-semibold">{team._count.stories}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Messages</span>
                        <span className="font-semibold">{team._count.messages}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
