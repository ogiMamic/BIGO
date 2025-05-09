import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import InitialTeamSetup from "@/components/InitialTeamSetup";
import Storytelling from "@/components/Storytelling";

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if the user has a team
  const hasTeam = await checkUserTeam(userId);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {hasTeam ? (
        <Storytelling />
      ) : (
        <InitialTeamSetup onTeamCreated={() => {}} />
      )}
    </div>
  );
}

async function checkUserTeam(userId: string): Promise<boolean> {
  // Implement the logic to check if the user has a team
  // This is a placeholder implementation
  try {
    // You would typically make a database query here
    // For now, we'll just return a random boolean
    return Math.random() < 0.5;
  } catch (error) {
    console.error("Error checking user team:", error);
    return false;
  }
}
