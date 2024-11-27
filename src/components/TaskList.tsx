import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle } from "lucide-react";
import { TaskCard } from "./TaskCard";

interface Task {
  id: string;
  title: string;
  status: string;
  assignee: string;
  description: string;
  labels: string[];
}

interface TaskListProps {
  status: string;
  columnIndex: number;
  tasks: Task[];
  columns: string[];
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent) => void;
  onTaskDragStart: (taskId: string) => void;
  onTaskDrop: (e: React.DragEvent, status: string) => void;
  onUpdateStatus: (taskId: string, newStatus: string) => void;
  onRemoveLabel: (taskId: string, label: string) => void;
  onAddTask?: () => void;
}

export function TaskList({
  status,
  columnIndex,
  tasks,
  columns,
  onDragStart: onColumnDragStart,
  onDragOver: onColumnDragOver,
  onDrop: onColumnDrop,
  onTaskDragStart,
  onTaskDrop,
  onUpdateStatus,
  onRemoveLabel,
  onAddTask,
}: TaskListProps) {
  const columnTasks = tasks.filter((task) => task.status === status);

  return (
    <Card
      draggable
      onDragStart={() => onColumnDragStart(columnIndex)}
      onDragOver={(e) => onColumnDragOver(e, columnIndex)}
      onDrop={onColumnDrop}
      className="w-[300px] bg-gray-800 border-gray-700 rounded-2xl overflow-hidden"
    >
      <CardHeader className="bg-gray-800/50 p-4 border-b border-gray-700">
        <CardTitle className="text-lg font-semibold text-green-500">
          {status}
          <span className="ml-2 text-sm text-gray-400">
            ({columnTasks.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent
        className="p-2"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onTaskDrop(e, status);
        }}
      >
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <div className="space-y-2">
            {columnTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                columns={columns}
                onDragStart={onTaskDragStart}
                onUpdateStatus={onUpdateStatus}
                onRemoveLabel={onRemoveLabel}
              />
            ))}
          </div>
          {status === "To Do" && onAddTask && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 text-xs border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded-full"
              onClick={onAddTask}
            >
              <PlusCircle className="mr-1 h-3 w-3" /> Add Task
            </Button>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
