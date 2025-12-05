import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "lucide-react"
import { BarChartComponent, LineChartComponent } from "@/components/ui/chart"

export function ChartTabs() {
  return (
    <Tabs defaultValue="bar" className="space-y-6">
      <TabsList className="bg-gray-800 rounded-xl p-1">
        <TabsTrigger
          value="bar"
          className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-green-500 rounded-lg transition-colors duration-200"
        >
          <BarChart className="mr-2 h-4 w-4" />
          Bar Chart
        </TabsTrigger>
        <TabsTrigger
          value="line"
          className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-green-500 rounded-lg transition-colors duration-200"
        >
          <LineChart className="mr-2 h-4 w-4" />
          Line Chart
        </TabsTrigger>
      </TabsList>
      <TabsContent value="bar">
        <BarChartComponent title="Monthly Revenue" description="Total revenue by month" />
      </TabsContent>
      <TabsContent value="line">
        <LineChartComponent title="Revenue Trend" description="Revenue trend over time" />
      </TabsContent>
    </Tabs>
  )
}
