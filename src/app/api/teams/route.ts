import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    console.log("[v0] GET /api/teams - Starting request")
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    console.log("[v0] Current user:", user?.id || "No user")

    if (authError || !user) {
      console.log("[v0] GET /api/teams - Unauthorized: No user")
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Find teams where the user is the owner
    const { data: teams, error } = await supabase.from("Team").select("*").eq("ownerId", user.id)

    if (error) {
      console.error("[v0] GET /api/teams - Database error:", error)
      return NextResponse.json({ error: "Failed to fetch teams", details: error.message }, { status: 500 })
    }

    console.log("[v0] GET /api/teams - Found teams:", teams?.length || 0)
    return NextResponse.json(teams || [])
  } catch (error) {
    console.error("[v0] GET /api/teams - Error:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    console.log("[v0] POST /api/teams - Starting request")

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] Current user check:", {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
    })

    if (authError || !user) {
      console.log("[v0] POST /api/teams - Unauthorized: No user found")
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    console.log("[v0] Request body:", body)
    const { name } = body

    if (!name || typeof name !== "string") {
      console.log("[v0] POST /api/teams - Invalid request: name validation failed")
      return NextResponse.json({ error: "Invalid request: name is required and must be a string" }, { status: 400 })
    }

    console.log("[v0] Creating team with name:", name, "for user:", user.id)

    // Create a team with the current user as owner
    const { data: team, error } = await supabase
      .from("Team")
      .insert({
        name,
        ownerId: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error details:", error)
      return NextResponse.json(
        {
          error: "Failed to create team",
          details: error.message,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Team created successfully:", team)
    return NextResponse.json(team)
  } catch (error) {
    console.error("[v0] POST /api/teams - Unexpected error:", {
      error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      {
        error: "Failed to create team",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
