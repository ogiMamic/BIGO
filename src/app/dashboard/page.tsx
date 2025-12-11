"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import InitialTeamSetup from "@/components/InitialTeamSetup"
import Storytelling from "@/components/Storytelling"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [hasTeam, setHasTeam] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in")
    } else if (isLoaded && isSignedIn) {
      checkUserTeam()
    }
  }, [isLoaded, isSignedIn, router])

  const checkUserTeam = async () => {
    try {
      const response = await fetch("/api/teams")
      if (response.ok) {
        const teams = await response.json()
        setHasTeam(teams.length > 0)
      } else {
        setHasTeam(false)
      }
    } catch (error) {
      console.error("Error checking user team:", error)
      setHasTeam(false)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        <p className="text-gray-400 mt-4 text-sm">Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 bg-gray-900 min-h-screen">
      {hasTeam && (
        <div className="mb-6 pl-12 md:pl-0">
          <h1 className="text-2xl md:text-3xl font-bold text-green-500">Welcome back, {user?.firstName || "there"}!</h1>
          <p className="text-sm md:text-base text-gray-400 mt-1">Here's what's happening with your team</p>
        </div>
      )}
      {hasTeam ? <Storytelling /> : <InitialTeamSetup onTeamCreated={() => setHasTeam(true)} />}
    </div>
  )
}
