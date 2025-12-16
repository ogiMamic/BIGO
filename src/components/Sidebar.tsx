"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  MessageSquare,
  BookOpen,
  BarChart,
  Users,
  CheckSquare,
  LayoutDashboard,
  TrendingUp,
  Radio,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard", description: "Overview of your team's activities" },
    { name: "KPI", icon: TrendingUp, href: "/kpi", description: "Track key performance indicators" },
    { name: "Storytelling", icon: BookOpen, href: "/storytelling", description: "Share and view team stories" },
    { name: "Streams", icon: Radio, href: "/streams", description: "Real-time activity feed" },
    { name: "Messages", icon: MessageSquare, href: "/messages", description: "Direct messages with team members" },
    { name: "Teams", icon: Users, href: "/teams", description: "Manage your teams" },
    { name: "Tasks", icon: CheckSquare, href: "/tasks", description: "Organize and track tasks" },
  ]

  return (
    <TooltipProvider>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside
        className={`
          fixed md:static
          inset-y-0 left-0
          w-64 bg-gray-800 border-r border-gray-700
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{ height: "100dvh" }}
      >
        <div className="p-4 flex items-center justify-between md:justify-start md:space-x-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <BarChart className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white">BIGO</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto min-h-0">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-700 ${
                        pathname === item.href ? "bg-gray-700 text-green-500" : "text-gray-300"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.description}</p>
                  </TooltipContent>
                </Tooltip>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 text-white hover:bg-gray-700 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}
    </TooltipProvider>
  )
}
