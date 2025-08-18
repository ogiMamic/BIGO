"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface InitialTeamSetupProps {
  onTeamCreated: () => void;
}

export default function InitialTeamSetup({
  onTeamCreated,
}: InitialTeamSetupProps) {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim()) {
      setLoading(true);
      setError(null);

      try {
        // Using Supabase client directly instead of fetch API
        const { data, error: supabaseError } = await supabase
          .from("team") // Note: using "team" instead of "teams" to match our schema
          .insert([{ name: teamName }])
          .select()
          .single();

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        toast.success("Team created successfully!");
        onTeamCreated();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create team";
        console.error("Error creating team:", error);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <Card className="w-full max-w-md bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-green-500">
            Welcome to BIGO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div>
              <label
                htmlFor="teamName"
                className="block text-sm font-medium text-gray-300"
              >
                Enter your team name to get started
              </label>
              <Input
                id="teamName"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-2 focus:ring-green-500"
                placeholder="Your Team Name"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm mt-2">Error: {error}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Team & Continue"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
