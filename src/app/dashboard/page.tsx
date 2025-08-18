"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InitialTeamSetup from "@/components/InitialTeamSetup";
import Storytelling from "@/components/Storytelling";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [hasTeam, setHasTeam] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    } else if (isLoaded && isSignedIn) {
      checkUserTeam();
    }
  }, [isLoaded, isSignedIn, router]);

  const checkUserTeam = async () => {
    try {
      const response = await fetch("/api/teams");
      if (response.ok) {
        const teams = await response.json();
        setHasTeam(teams.length > 0);
      } else {
        setHasTeam(false);
      }
    } catch (error) {
      console.error("Error checking user team:", error);
      setHasTeam(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {hasTeam ? (
        <Storytelling />
      ) : (
        <InitialTeamSetup onTeamCreated={() => setHasTeam(true)} />
      )}
    </div>
  );
}
