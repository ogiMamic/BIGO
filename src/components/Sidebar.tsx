"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  BookOpen,
  BarChart,
  Users,
  CheckSquare,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Storytelling", icon: BookOpen, href: "/storytelling" },
    { name: "Messages", icon: MessageSquare, href: "/messages" },
    { name: "Teams", icon: Users, href: "/teams" },
    { name: "Tasks", icon: CheckSquare, href: "/tasks" },
  ];

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 h-screen flex flex-col">
      <div className="p-4 flex items-center space-x-2">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <BarChart className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-white">BIGO</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-700 ${
                  pathname === item.href
                    ? "bg-gray-700 text-green-500"
                    : "text-gray-300"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 flex items-center justify-between">
        <UserButton afterSignOutUrl="/" />
        <Link href="/sign-out" className="text-gray-300 hover:text-white">
          <LogOut className="h-5 w-5" />
        </Link>
      </div>
    </aside>
  );
}
