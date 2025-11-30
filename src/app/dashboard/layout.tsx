"use client";

import type React from "react";

import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [mounted, isLoaded, isSignedIn, router]);

  if (!mounted || !isLoaded || !isSignedIn) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        suppressHydrationWarning
      >
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" suppressHydrationWarning>
      <nav className="flex justify-between items-center p-4 bg-gray-800">
        <h1 className="text-2xl font-bold text-green-500">BIGO</h1>
        <UserButton afterSignOutUrl="/sign-in" />
      </nav>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
