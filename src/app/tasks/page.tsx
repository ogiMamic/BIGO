"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Sidebar from "@/components/Sidebar";
import { TaskList } from "@/components/TaskList";
import { TaskFilters } from "@/components/TaskFilters";
import { AddColumnDialog } from "@/components/AddColumnDialog";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { Task } from "@/types/task";

const initialColumns = ["To Do", "In Progress", "Completed"];
const labelOptions = ["development", "marketing", "design", "management"];

export default function TasksPage() {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState(initialColumns);
  const [newTask, setNewTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
    assignee: user?.fullName || "",
    assigneeId: user?.id || "",
    status: "To Do",
    labels: [],
  });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [filterLabel, setFilterLabel] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const draggedTask = useRef<string | null>(null);
  const draggedColumn = useRef<number | null>(null);
  const draggedOverColumn = useRef<number | null>(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const formattedTasks = storedTasks.map((task: any) => ({
      ...task,
      status: task.status || "To Do",
      labels: task.labels || [],
      assignee: task.assignee || "Unassigned",
      assigneeId: task.assigneeId || "",
    }));
    setTasks(formattedTasks);
  }, []);

  const addTask = useCallback(() => {
    if (newTask.title.trim()) {
      const taskToAdd = {
        ...newTask,
        id: Date.now().toString(),
        status: newTask.status || "To Do",
        assignee: newTask.assignee || user?.fullName || "Unassigned",
        assigneeId: newTask.assigneeId || user?.id || "",
        labels: newTask.labels.filter((label) => label.trim() !== ""),
      };
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, taskToAdd];
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        return updatedTasks;
      });
      setNewTask({
        id: "",
        title: "",
        description: "",
        assignee: user?.fullName || "",
        assigneeId: user?.id || "",
        status: "To Do",
        labels: [],
      });
      setIsAddingTask(false);
    }
  }, [newTask, user]);

  const addColumn = useCallback(() => {
    if (newColumnTitle.trim()) {
      setColumns((prevColumns) => [...prevColumns, newColumnTitle]);
      setNewColumnTitle("");
      setIsAddingColumn(false);
    }
  }, [newColumnTitle]);

  const handleTaskChange = (field: keyof Task, value: string) => {
    setNewTask((prev) => ({ ...prev, [field]: value }));
  };

  const updateTaskStatus = useCallback((taskId: string, newStatus: string) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  }, []);

  const removeLabel = useCallback((taskId: string, label: string) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, labels: task.labels.filter((l) => l !== label) }
          : task
      );
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  }, []);

  const handleColumnDragStart = (index: number) => {
    draggedColumn.current = index;
  };

  const handleColumnDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    draggedOverColumn.current = index;
  };

  const handleColumnDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedColumn.current !== null && draggedOverColumn.current !== null) {
      const newColumns = [...columns];
      const draggedItem = newColumns[draggedColumn.current];
      newColumns.splice(draggedColumn.current, 1);
      newColumns.splice(draggedOverColumn.current, 0, draggedItem);
      setColumns(newColumns);

      draggedColumn.current = null;
      draggedOverColumn.current = null;
    }
  };

  const handleTaskDragStart = (taskId: string) => {
    draggedTask.current = taskId;
  };

  const handleTaskDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedTask.current) {
      updateTaskStatus(draggedTask.current, newStatus);
      draggedTask.current = null;
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (filterLabel === "all" || task.labels.includes(filterLabel)) &&
      (filterUser === "all" || task.assignee === filterUser)
  );

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="p-4 bg-gray-800 rounded-b-2xl shadow-md">
          <h1 className="text-2xl font-bold text-green-500">TASKS</h1>
        </header>
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          <TaskFilters
            filterLabel={filterLabel}
            filterUser={filterUser}
            onFilterLabel={setFilterLabel}
            onFilterUser={setFilterUser}
            labelOptions={labelOptions}
            userOptions={Array.from(
              new Set(tasks.map((task) => task.assignee))
            )}
            onAddColumnClick={() => setIsAddingColumn(true)}
          />
          <div className="flex-1 overflow-x-auto mt-6">
            <div className="flex gap-6 h-full min-w-min">
              {columns.map((column, index) => (
                <div
                  key={column}
                  className="flex-shrink-0 first:ml-0 last:mr-0"
                >
                  <TaskList
                    status={column}
                    columnIndex={index}
                    tasks={filteredTasks.filter(
                      (task) => task.status === column
                    )}
                    columns={columns}
                    onDragStart={handleColumnDragStart}
                    onDragOver={handleColumnDragOver}
                    onDrop={handleColumnDrop}
                    onTaskDragStart={handleTaskDragStart}
                    onTaskDrop={handleTaskDrop}
                    onUpdateStatus={updateTaskStatus}
                    onRemoveLabel={removeLabel}
                    onAddTask={() => setIsAddingTask(true)}
                  />
                </div>
              ))}
            </div>
          </div>
          <AddColumnDialog
            isOpen={isAddingColumn}
            onOpenChange={setIsAddingColumn}
            onAdd={addColumn}
            title={newColumnTitle}
            onTitleChange={setNewColumnTitle}
          />
          <AddTaskDialog
            isOpen={isAddingTask}
            onOpenChange={setIsAddingTask}
            task={newTask}
            onTaskChange={handleTaskChange}
            onAdd={addTask}
            teamMembers={[{ id: user?.id || "", name: user?.fullName || "" }]}
          />
        </div>
      </div>
    </div>
  );
}
