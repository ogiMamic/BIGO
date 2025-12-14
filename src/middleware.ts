import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"])

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/teams(.*)",
  "/api/stories(.*)",
  "/api/tasks(.*)",
  "/api/storytellings(.*)",
  "/storytelling(.*)",
  "/messages(.*)",
  "/teams(.*)",
  "/tasks(.*)",
  "/kpi(.*)",
  "/streams(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req) && isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
