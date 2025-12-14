"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Users, Plus, ArrowRight } from "lucide-react"

interface Team {
  id: string
  name: string
  owner: {
    id: string
    name: string | null
    email: string
  }
  _count: {
    members: number
  }
}

interface InitialTeamSetupProps {
  onTeamCreated: () => void
}

export default function InitialTeamSetup({ onTeamCreated }: InitialTeamSetupProps) {
  const [mode, setMode] = useState<"select" | "create">("select")
  const [teamName, setTeamName] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingTeams, setLoadingTeams] = useState(true)
  const [existingTeams, setExistingTeams] = useState<Team[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchExistingTeams()
  }, [])

  const fetchExistingTeams = async () => {
    try {
      setLoadingTeams(true)
      console.log("[v0] Fetching existing teams...")
      const response = await fetch("/api/teams")
      console.log("[v0] Teams response status:", response.status)
      if (response.ok) {
        const teams = await response.json()
        console.log("[v0] Teams fetched:", teams.length, teams)
        setExistingTeams(teams)
        // If no teams exist, switch to create mode automatically
        if (teams.length === 0) {
          console.log("[v0] No teams found, switching to create mode")
          setMode("create")
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching teams:", error)
    } finally {
      setLoadingTeams(false)
    }
  }

  const handleJoinTeam = async (teamId: string) => {
    setLoading(true)
    setError(null)

    try {
      console.log("[v0] Joining team:", teamId)
      const response = await fetch(`/api/teams/${teamId}/join`, {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] Failed to join team:", errorData)
        throw new Error(errorData.error || "Failed to join team")
      }

      console.log("[v0] Successfully joined team")
      toast.success("Successfully joined team!")
      onTeamCreated()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to join team"
      console.error("[v0] Error joining team:", error)
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (teamName.trim()) {
      setLoading(true)
      setError(null)

      try {
        console.log("[v0] Creating team with name:", teamName)
        const response = await fetch("/api/teams", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: teamName }),
        })

        console.log("[v0] Team creation response status:", response.status)

        if (!response.ok) {
          const errorData = await response.json()
          console.error("[v0] Team creation error response:", errorData)
          throw new Error(errorData.details || errorData.error || "Failed to create team")
        }

        const team = await response.json()
        console.log("[v0] Team created successfully:", team)

        toast.success("Team created successfully!")
        onTeamCreated()
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create team"
        console.error("[v0] Error creating team:", error)
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }
  }

  if (loadingTeams) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4" suppressHydrationWarning>
      <Card className="w-full max-w-2xl bg-gray-800 text-white border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-500">Welcome to BIGO!</CardTitle>
          <CardDescription className="text-gray-400 mt-2">
            {mode === "select" && existingTeams.length > 0
              ? "Join an existing team or create a new one"
              : "Let's get started by creating your first team"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "select" && existingTeams.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Available Teams</h3>
                {existingTeams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-white">{team.name}</h4>
                      <p className="text-sm text-gray-400">
                        Created by {team.owner.name || team.owner.email} • {team._count.members} members
                      </p>
                    </div>
                    <Button
                      onClick={() => handleJoinTeam(team.id)}
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-800 px-2 text-gray-400">Or</span>
                </div>
              </div>

              <Button
                onClick={() => setMode("create")}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Team
              </Button>
            </div>
          ) : (
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-2">
                  Team Name
                </label>
                <Input
                  id="teamName"
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="block w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Marketing Team, Project Alpha"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">Choose a name that represents your team or project</p>
              </div>

              {error && (
                <div className="text-red-400 text-sm mt-2 p-3 bg-red-900/20 rounded border border-red-800">
                  <strong>Error:</strong> {error}
                </div>
              )}

              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Team...
                    </>
                  ) : (
                    "Create Team & Get Started"
                  )}
                </Button>

                {existingTeams.length > 0 && (
                  <Button
                    type="button"
                    onClick={() => setMode("select")}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    disabled={loading}
                  >
                    Back to Team Selection
                  </Button>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
