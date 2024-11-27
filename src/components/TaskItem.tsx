import { useState, useCallback } from "react";
import { PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskItem from "./TaskItem";

type Task = {
  id: string;
  title: string;
  status: string;
  assignee: string;
  description: string;
  labels: string[];
};

type TaskListProps = {
  status: string;
  tasks: Task[];
  columns: string[];
  onUpdateTaskStatus: (taskId: string, newStatus: string) => void;
  onAddLabel: (taskId: string, label: string) => void;
  onRemoveLabel: (taskId: string, label: string) => void;
  onAddTask: () => void;
};

export default function TaskList({
  status,
  tasks,
  columns,
  onUpdateTaskStatus,
  onAddLabel,
  onRemoveLabel,
  onAddTask,
}: TaskListProps) {
  return (
    <Card className="bg-zinc-800 shadow-md rounded-lg overflow-hidden border-zinc-700">
      <CardHeader className="bg-zinc-800/50 p-4 border-b border-zinc-700">
        <CardTitle className="text-lg font-semibold text-zinc-200">
          {status}
        </CardTitle>
        <CardDescription className="text-xs text-zinc-400">
          {tasks.length} tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-[calc(100vh-20rem)]">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              columns={columns}
              onUpdateStatus={onUpdateTaskStatus}
              onAddLabel={onAddLabel}
              onRemoveLabel={onRemoveLabel}
            />
          ))}
        </ScrollArea>
        {status === "To Do" && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 text-xs border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-50"
            onClick={onAddTask}
          >
            <PlusCircle className="mr-1 h-3 w-3" /> Add Task
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
