import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  status: string;
  assignee: string;
  description: string;
  labels: string[];
}

interface TaskCardProps {
  task: Task;
  columns: string[];
  onDragStart: (taskId: string) => void;
  onUpdateStatus: (taskId: string, newStatus: string) => void;
  onRemoveLabel: (taskId: string, label: string) => void;
}

export function TaskCard({
  task,
  columns,
  onDragStart,
  onUpdateStatus,
  onRemoveLabel,
}: TaskCardProps) {
  return (
    <Card
      draggable
      onDragStart={(e) => {
        e.stopPropagation(); // Prevent column drag when dragging task
        onDragStart(task.id);
      }}
      className="mb-2 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-800 border-gray-700 rounded-xl cursor-move"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${task.assignee}`}
            />
            <AvatarFallback>{task.assignee[0]}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-sm font-medium text-white">
            {task.title}
          </CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-700"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-36 bg-gray-800 border-gray-700"
          >
            <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
            {columns.map((column) => (
              <DropdownMenuItem
                key={column}
                onClick={() => onUpdateStatus(task.id, column)}
                className="text-xs hover:bg-gray-700"
              >
                Move to {column}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="text-xs text-red-400 hover:bg-gray-700">
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-xs text-gray-400 mb-2">{task.description}</p>
        <div className="flex flex-wrap gap-1">
          {task.labels.map((label) => (
            <Badge
              key={label}
              variant="secondary"
              className="text-[10px] px-2 py-0.5 bg-gray-700 hover:bg-gray-600"
            >
              {label}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0 hover:bg-gray-600"
                onClick={() => onRemoveLabel(task.id, label)}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
