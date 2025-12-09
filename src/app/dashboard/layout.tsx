"use client"

import type React from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import Sidebar from "@/components/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && isLoaded && !isSignedIn) {
      router.push("/sign-in")
    }
  }, [mounted, isLoaded, isSignedIn, router])

  if (!mounted || !isLoaded || !isSignedIn) {
    return (
      <div className="flex items-center justify-center h-screen" suppressHydrationWarning>
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden" suppressHydrationWarning>
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-900 w-full pl-0 md:pl-0">{children}</main>
    </div>
  )
}
