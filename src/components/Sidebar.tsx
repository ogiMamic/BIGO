"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  MessageSquare,
  BookOpen,
  BarChart,
  Users,
  CheckSquare,
  LogOut,
  LayoutDashboard,
  TrendingUp,
  Radio,
  Menu,
  X,
} from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "KPI", icon: TrendingUp, href: "/kpi" },
    { name: "Storytelling", icon: BookOpen, href: "/storytelling" },
    { name: "Streams", icon: Radio, href: "/streams" },
    { name: "Messages", icon: MessageSquare, href: "/messages" },
    { name: "Teams", icon: Users, href: "/teams" },
    { name: "Tasks", icon: CheckSquare, href: "/tasks" },
  ]

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 text-white hover:bg-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside
        className={`
          fixed md:static
          inset-y-0 left-0
          w-64 bg-gray-800 border-r border-gray-700
          h-screen flex flex-col
          transform transition-transform duration-300 ease-in-out
          z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-4 pt-16 md:pt-4 flex items-center space-x-2">
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
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-700 ${
                    pathname === item.href ? "bg-gray-700 text-green-500" : "text-gray-300"
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
    </>
  )
}
