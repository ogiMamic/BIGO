"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Circle, Plus, FolderPlus, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  folderId?: number
}

interface Folder {
  id: number
  name: string
  tasks: Task[]
}

export default function Tasks() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [newFolderName, setNewFolderName] = useState("")
  const [newTask, setNewTask] = useState({ folderId: -1, title: "", description: "" })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFolders()
  }, [])

  useEffect(() => {
    if (!isLoading && folders.length > 0) {
      localStorage.setItem("bigo-task-folders", JSON.stringify(folders))
      saveFoldersToAPI()
    }
  }, [folders, isLoading])

  const fetchFolders = async () => {
    try {
      // Try to load from localStorage first
      const cached = localStorage.getItem("bigo-task-folders")
      if (cached) {
        setFolders(JSON.parse(cached))
      }

      // Then fetch from API
      const response = await fetch("/api/tasks")
      if (response.ok) {
        const data = await response.json()
        const foldersMap = new Map<number, Folder>()

        // Organize tasks into folders
        data.forEach((task: Task) => {
          const folderId = task.folderId || 0
          if (!foldersMap.has(folderId)) {
            foldersMap.set(folderId, {
              id: folderId,
              name: folderId === 0 ? "Uncategorized" : `Folder ${folderId}`,
              tasks: [],
            })
          }
          foldersMap.get(folderId)!.tasks.push(task)
        })

        setFolders(Array.from(foldersMap.values()))
      }
    } catch (error) {
      console.error("[v0] Error fetching folders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveFoldersToAPI = async () => {
    try {
      // Save all tasks with their folder assignments
      const allTasks = folders.flatMap((folder) => folder.tasks.map((task) => ({ ...task, folderId: folder.id })))

      await fetch("/api/tasks/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: allTasks }),
      })
    } catch (error) {
      console.error("[v0] Error saving folders:", error)
    }
  }

  const addFolder = () => {
    if (!newFolderName.trim()) return

    const newFolder: Folder = {
      id: Date.now(),
      name: newFolderName,
      tasks: [],
    }

    setFolders([...folders, newFolder])
    setNewFolderName("")
    toast({ title: "Folder created successfully!" })
  }

  const deleteFolder = (folderId: number) => {
    setFolders(folders.filter((f) => f.id !== folderId))
    toast({ title: "Folder deleted" })
  }

  const addTask = async () => {
    if (!newTask.title.trim() || newTask.folderId === -1) return

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          folderId: newTask.folderId,
        }),
      })

      if (response.ok) {
        const task = await response.json()
        const updatedFolders = folders.map((folder) =>
          folder.id === newTask.folderId ? { ...folder, tasks: [...folder.tasks, task] } : folder,
        )
        setFolders(updatedFolders)
        setNewTask({ folderId: -1, title: "", description: "" })
        toast({ title: "Task created successfully!" })
      }
    } catch (error) {
      console.error("[v0] Error creating task:", error)
      toast({ title: "Failed to create task", variant: "destructive" })
    }
  }

  const toggleTaskCompletion = async (folderId: number, taskId: number) => {
    const updatedFolders = folders.map((folder) =>
      folder.id === folderId
        ? {
            ...folder,
            tasks: folder.tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
          }
        : folder,
    )
    setFolders(updatedFolders)

    // Auto-save to API
    const task = updatedFolders.find((f) => f.id === folderId)?.tasks.find((t) => t.id === taskId)
    if (task) {
      try {
        await fetch(`/api/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: task.completed }),
        })
      } catch (error) {
        console.error("[v0] Error updating task:", error)
      }
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="p-4 bg-gray-800 rounded-b-2xl shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-500">TASKS</h1>
            <p className="text-sm text-gray-400">Organize tasks into folders</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-green-500">Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="bg-gray-700 border-gray-600 text-white"
                  onKeyPress={(e) => e.key === "Enter" && addFolder()}
                />
                <Button onClick={addFolder} className="w-full bg-green-500 hover:bg-green-600">
                  Create Folder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="text-center text-gray-400 py-10">Loading tasks...</div>
        ) : (
          <div className="space-y-6">
            {folders.map((folder) => (
              <div key={folder.id} className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-green-500">{folder.name}</h2>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="border-gray-600 bg-transparent">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Task
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-green-500">Add Task to {folder.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            value={newTask.folderId === folder.id ? newTask.title : ""}
                            onChange={(e) =>
                              setNewTask({
                                folderId: folder.id,
                                title: e.target.value,
                                description: newTask.description,
                              })
                            }
                            placeholder="Task title"
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                          <Input
                            value={newTask.folderId === folder.id ? newTask.description : ""}
                            onChange={(e) =>
                              setNewTask({ folderId: folder.id, title: newTask.title, description: e.target.value })
                            }
                            placeholder="Task description"
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                          <Button onClick={addTask} className="w-full bg-green-500 hover:bg-green-600">
                            Add Task
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {folder.id !== 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteFolder(folder.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {folder.tasks.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No tasks in this folder</p>
                  ) : (
                    folder.tasks.map((task) => (
                      <Card key={task.id} className="bg-gray-800 border-gray-700 rounded-2xl shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between py-3">
                          <CardTitle
                            className={`text-base ${task.completed ? "text-gray-500 line-through" : "text-green-500"}`}
                          >
                            {task.title}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleTaskCompletion(folder.id, task.id)}
                            className="rounded-full"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400" />
                            )}
                          </Button>
                        </CardHeader>
                        {task.description && (
                          <CardContent className="pt-0">
                            <p className={`text-sm ${task.completed ? "text-gray-500" : "text-gray-300"}`}>
                              {task.description}
                            </p>
                          </CardContent>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
