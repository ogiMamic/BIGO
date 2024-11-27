"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Circle } from "lucide-react";

const initialTasks = [
  {
    id: 1,
    title: "Review Q3 Marketing Campaign",
    description: "Analyze the results and prepare report",
    completed: false,
    storyId: 2,
  },
  {
    id: 2,
    title: "Update Liquidity Report",
    description: "Include latest financial data",
    completed: true,
    storyId: 1,
  },
  {
    id: 3,
    title: "Prepare New Product Launch",
    description: "Finalize marketing materials and distribution plan",
    completed: false,
    storyId: 3,
  },
];

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="p-4 bg-gray-800 rounded-b-2xl shadow-md">
        <h1 className="text-2xl  font-bold text-green-500">TASKS</h1>
      </header>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="bg-gray-800 border-gray-700 rounded-2xl shadow-md"
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle
                  className={`text-lg ${
                    task.completed
                      ? "text-gray-500 line-through"
                      : "text-green-500"
                  }`}
                >
                  {task.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleTaskCompletion(task.id)}
                  className="rounded-full"
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400" />
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-sm ${
                    task.completed ? "text-gray-500" : "text-gray-300"
                  }`}
                >
                  {task.description}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Related to Story #{task.storyId}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
