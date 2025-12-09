"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, CheckCircle, MessageSquare, BookOpen } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Sidebar from "@/components/Sidebar"
import { toast } from "@/hooks/use-toast"

interface KPIData {
  activeUsers: number
  tasksCompleted: number
  messagesExchanged: number
  storiesShared: number
  teamGrowth: number
  taskCompletionRate: number
}

export default function KPIDashboard() {
  const [kpiData, setKpiData] = useState<KPIData>({
    activeUsers: 0,
    tasksCompleted: 0,
    messagesExchanged: 0,
    storiesShared: 0,
    teamGrowth: 0,
    taskCompletionRate: 0,
  })

  useEffect(() => {
    fetchKPIData()
    const interval = setInterval(fetchKPIData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchKPIData = async () => {
    try {
      const response = await fetch("/api/kpi")
      if (response.ok) {
        const data = await response.json()
        setKpiData(data)
      } else {
        const error = await response.json()
        toast({
          title: "Error loading KPIs",
          description: error.error || "Failed to fetch KPI data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching KPI data:", error)
      toast({
        title: "Error loading KPIs",
        description: "Could not connect to server",
        variant: "destructive",
      })
    }
  }

  const kpiCards = [
    {
      title: "Active Users",
      value: kpiData.activeUsers,
      icon: Users,
      trend: kpiData.teamGrowth,
      color: "text-green-500",
    },
    {
      title: "Tasks Completed",
      value: kpiData.tasksCompleted,
      icon: CheckCircle,
      trend: 12,
      color: "text-blue-500",
    },
    {
      title: "Messages",
      value: kpiData.messagesExchanged,
      icon: MessageSquare,
      trend: 8,
      color: "text-purple-500",
    },
    {
      title: "Stories Shared",
      value: kpiData.storiesShared,
      icon: BookOpen,
      trend: 15,
      color: "text-yellow-500",
    },
  ]

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-green-500">KPI Dashboard</h1>
          <p className="text-sm md:text-base text-gray-400 mt-2">
            Monitor your team's performance with real-time metrics. Track user activity, task completion, and engagement
            across all features.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpiCards.map((kpi, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium text-gray-400">{kpi.title}</CardTitle>
                  <p className="text-xs text-gray-500 mt-1">
                    {index === 0 && "Total team members"}
                    {index === 1 && "Tasks marked as completed"}
                    {index === 2 && "Total messages sent"}
                    {index === 3 && "Stories published by team"}
                  </p>
                </div>
                <kpi.icon className={`h-5 w-5 ${kpi.color} flex-shrink-0`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{kpi.value}</div>
                <div className="flex items-center text-xs mt-1">
                  {kpi.trend >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={kpi.trend >= 0 ? "text-green-500" : "text-red-500"}>{Math.abs(kpi.trend)}%</span>
                  <span className="text-gray-400 ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-green-500">Task Completion Rate</CardTitle>
              <p className="text-xs text-gray-400 mt-1">Percentage of completed tasks vs total tasks</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Overall Progress</span>
                    <span className="text-sm font-medium text-white">{kpiData.taskCompletionRate}%</span>
                  </div>
                  <Progress value={kpiData.taskCompletionRate} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-green-500">Team Activity</CardTitle>
              <p className="text-xs text-gray-400 mt-1">Recent team engagement metrics</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Messages Today</span>
                  <span className="text-lg font-semibold text-white">{kpiData.messagesExchanged}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Stories Shared</span>
                  <span className="text-lg font-semibold text-white">{kpiData.storiesShared}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Active Members</span>
                  <span className="text-lg font-semibold text-white">{kpiData.activeUsers}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
