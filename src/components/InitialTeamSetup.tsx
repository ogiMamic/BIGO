"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Users } from "lucide-react"

interface InitialTeamSetupProps {
  onTeamCreated: () => void
}

export default function InitialTeamSetup({ onTeamCreated }: InitialTeamSetupProps) {
  const [teamName, setTeamName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (teamName.trim()) {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/teams", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: teamName }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create team")
        }

        const team = await response.json()

        toast.success("Team created successfully!")
        onTeamCreated()
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create team"
        console.error("Error creating team:", error)
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4" suppressHydrationWarning>
      <Card className="w-full max-w-md bg-gray-800 text-white border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-500">Welcome to BIGO!</CardTitle>
          <CardDescription className="text-gray-400 mt-2">
            Let's get started by creating your team. You'll be able to collaborate, share stories, and track tasks
            together.
          </CardDescription>
        </CardHeader>
        <CardContent>
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

            {error && <div className="text-red-400 text-sm mt-2 p-2 bg-red-900/20 rounded">Error: {error}</div>}

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
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
