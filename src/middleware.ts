import { clerkMiddleware, createRouteMatcher, getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/teams(.*)",
  "/api/stories(.*)",
  "/api/tasks(.*)",
  "/teams(.*)",
  "/tasks(.*)",
  "/storytelling(.*)",
  "/messages(.*)",
  "/streams(.*)",
])

export default clerkMiddleware((arg1, arg2) => {
  // Clerk's middleware may call the handler with either (req) or (auth, req).
  // Normalize to a Request-like object in `req` so `isProtectedRoute` works.
  const req = arg2 ?? arg1

  if (!req) return

  if (isProtectedRoute(req)) {
    const { userId } = getAuth(req)
    if (!userId) {
      // Not authenticated — redirect to sign-in
      const redirectUrl = req.url ? new URL('/sign-in', req.url) : new URL('/sign-in', 'http://localhost:3000')
      return NextResponse.redirect(redirectUrl)
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
