import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function getCurrentUserWithOrg() {
  const { userId } = await auth()
  if (!userId) {
    return null
  }

  const clerkUser = await currentUser()
  if (!clerkUser) {
    return null
  }

  // Upsert user with Clerk data
  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      name:
        clerkUser.firstName && clerkUser.lastName
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress || userId,
      email: clerkUser.emailAddresses[0]?.emailAddress || `${userId}@clerk.user`,
    },
    create: {
      clerkId: userId,
      name:
        clerkUser.firstName && clerkUser.lastName
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress || userId,
      email: clerkUser.emailAddresses[0]?.emailAddress || `${userId}@clerk.user`,
      organization: {
        connectOrCreate: {
          where: { slug: "default" },
          create: {
            name: "Default Organization",
            slug: "default",
          },
        },
      },
    },
    select: {
      id: true,
      clerkId: true,
      name: true,
      email: true,
      organizationId: true,
    },
  })

  return user
}
