"use client";

import { useAuth } from "@clerk/nextjs";
import { SignIn } from "@clerk/nextjs";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, isLoaded, router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Welcome to Bigo
              </h1>
              <p className="text-xl text-gray-300">
                Collaborate, manage tasks, and communicate with your team at
                evidanzabigo.com
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Streamlined task management with drag-and-drop interface",
                "Real-time team collaboration and communication",
                "Integrated storytelling features for better project documentation",
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                  <p className="text-gray-300">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pl-12">
            {!isSignedIn && (
              <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
                <h2 className="text-2xl font-semibold mb-6 text-green-400">
                  Sign in to your account
                </h2>
                <SignIn routing="hash" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
