"use client";

import { Users, Folder, CheckSquare, TrendingUp } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChartTabs } from "@/components/dashboard/ChartTabs";

export default function DashboardPage() {
  const statsData = [
    {
      title: "Total Users",
      icon: Users,
      value: "1,234",
      change: "+10% from last month",
    },
    {
      title: "Active Projects",
      icon: Folder,
      value: "23",
      change: "+2 new this week",
    },
    {
      title: "Tasks Completed",
      icon: CheckSquare,
      value: "789",
      change: "+15% from last week",
    },
    {
      title: "Team Performance",
      icon: TrendingUp,
      value: "92%",
      change: "+3% from last month",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-green-500">Dashboard</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statsData.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
          <ChartTabs />
        </div>
      </main>
    </div>
  );
}
