"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Sidebar from "@/components/Sidebar"
import { Plus, FolderOpen } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Story {
  id: number
  title: string
  content: string
}

interface Stream {
  id: number
  name: string
  stories: Story[]
}

export default function StreamsPage() {
  const [streams, setStreams] = useState<Stream[]>([])
  const [newStreamName, setNewStreamName] = useState("")
  const [newStory, setNewStory] = useState({ streamId: -1, title: "", content: "" })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStreams()
  }, [])

  const fetchStreams = async () => {
    try {
      const response = await fetch("/api/streams")
      if (response.ok) {
        const data = await response.json()
        setStreams(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching streams:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addStream = async () => {
    if (!newStreamName.trim()) return

    try {
      const response = await fetch("/api/streams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newStreamName }),
      })

      if (response.ok) {
        const newStream = await response.json()
        setStreams([...streams, newStream])
        setNewStreamName("")
        toast({ title: "Stream created successfully!" })
      }
    } catch (error) {
      console.error("[v0] Error creating stream:", error)
      toast({ title: "Failed to create stream", variant: "destructive" })
    }
  }

  const addStory = async () => {
    if (!newStory.title.trim() || newStory.streamId === -1) return

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newStory.title,
          content: newStory.content,
          streamId: newStory.streamId,
        }),
      })

      if (response.ok) {
        const story = await response.json()
        const updatedStreams = streams.map((stream) =>
          stream.id === newStory.streamId ? { ...stream, stories: [...stream.stories, story] } : stream,
        )
        setStreams(updatedStreams)
        setNewStory({ streamId: -1, title: "", content: "" })
        toast({ title: "Story added successfully!" })
      }
    } catch (error) {
      console.error("[v0] Error adding story:", error)
      toast({ title: "Failed to add story", variant: "destructive" })
    }
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-green-500">Streams</h1>
          <p className="text-gray-400 mt-2">Categorical feeds with story groups</p>
        </header>

        <div className="flex gap-2 mb-6">
          <Input
            value={newStreamName}
            onChange={(e) => setNewStreamName(e.target.value)}
            placeholder="New stream name"
            className="bg-gray-800 border-gray-700 text-white"
            onKeyPress={(e) => e.key === "Enter" && addStream()}
          />
          <Button onClick={addStream} className="bg-green-500 hover:bg-green-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Stream
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-400 py-10">Loading streams...</div>
        ) : streams.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            <FolderOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>No streams yet. Create your first stream above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {streams.map((stream) => (
              <Card key={stream.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-green-500">{stream.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-3">{stream.stories.length} stories</p>
                  <ul className="space-y-2 mb-4">
                    {stream.stories.slice(0, 3).map((story) => (
                      <li key={story.id} className="text-sm text-gray-300 truncate">
                        • {story.title}
                      </li>
                    ))}
                    {stream.stories.length > 3 && (
                      <li className="text-sm text-gray-500">+{stream.stories.length - 3} more</li>
                    )}
                  </ul>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full border-gray-600 bg-transparent">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Story
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-green-500">Add story to {stream.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          value={newStory.streamId === stream.id ? newStory.title : ""}
                          onChange={(e) =>
                            setNewStory({ streamId: stream.id, title: e.target.value, content: newStory.content })
                          }
                          placeholder="Story title"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                        <Input
                          value={newStory.streamId === stream.id ? newStory.content : ""}
                          onChange={(e) =>
                            setNewStory({ streamId: stream.id, title: newStory.title, content: e.target.value })
                          }
                          placeholder="Story content"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                        <Button onClick={addStory} className="w-full bg-green-500 hover:bg-green-600">
                          Add Story
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
