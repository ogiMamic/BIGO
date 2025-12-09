"use client"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard")
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    )
  }

  if (isSignedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-500 mb-4">BIGO</h1>
        <p className="text-gray-300 mb-8">Welcome to BIGO Application</p>
        <div className="space-x-4">
          <Button onClick={() => router.push("/sign-in")} className="bg-green-500 hover:bg-green-600">
            Sign In
          </Button>
          <Button
            onClick={() => router.push("/sign-up")}
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  )
}
