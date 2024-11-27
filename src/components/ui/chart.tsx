"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Sample data for the charts
const data = [
  { name: "Jan", total: 1000 },
  { name: "Feb", total: 1200 },
  { name: "Mar", total: 900 },
  { name: "Apr", total: 1500 },
  { name: "May", total: 1800 },
  { name: "Jun", total: 2000 },
  { name: "Jul", total: 2200 },
  { name: "Aug", total: 2100 },
  { name: "Sep", total: 2300 },
  { name: "Oct", total: 2500 },
  { name: "Nov", total: 2700 },
  { name: "Dec", total: 3000 },
];

interface ChartProps {
  title: string;
  description?: string;
}

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-2 rounded-md shadow-md">
        <p className="text-gray-300">{`${label} : $${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export function BarChartComponent({ title, description }: ChartProps) {
  return (
    <Card className="w-full bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-green-500">{title}</CardTitle>
        {description && (
          <CardDescription className="text-gray-400">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="total" fill="#4ade80" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function LineChartComponent({ title, description }: ChartProps) {
  return (
    <Card className="w-full bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-green-500">{title}</CardTitle>
        {description && (
          <CardDescription className="text-gray-400">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#4ade80"
              strokeWidth={2}
              dot={{ fill: "#4ade80" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
