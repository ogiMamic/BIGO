"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Heart, MessageCircle, Send, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"

interface Comment {
  id: string
  content: string
  authorId: string // Added authorId for delete authorization
  author: {
    id: string
    name: string | null
    email: string
  }
  createdAt: string
}

interface Story {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string | null
    email: string
  }
  _count: {
    likes: number
    comments: number
  }
  createdAt: string
}

export default function Storytelling() {
  const { user } = useUser()
  const [stories, setStories] = useState<Story[]>([])
  const [newStoryTitle, setNewStoryTitle] = useState("")
  const [newStoryContent, setNewStoryContent] = useState("")
  const [selectedStory, setSelectedStory] = useState<string | null>(null)
  const [comments, setComments] = useState<Record<string, Comment[]>>({})
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    const syncUserData = async () => {
      try {
        await fetch("/api/users", { method: "POST" })
      } catch (error) {
        console.error("Failed to sync user data:", error)
      }
    }

    syncUserData()
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const response = await fetch("/api/stories")
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Failed to fetch stories" }))
        throw new Error(error.error || "Failed to fetch stories")
      }
      const data = await response.json()
      setStories(data)
    } catch (error) {
      console.error("Error fetching stories:", error)
      toast.error(error instanceof Error ? error.message : "Failed to fetch stories. Please try again later.")
    }
  }

  const handleNewStory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newStoryTitle.trim() && newStoryContent.trim()) {
      try {
        const response = await fetch("/api/stories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newStoryTitle, content: newStoryContent }),
        })

        if (!response.ok) {
          const error = await response.json().catch(() => ({ error: "Failed to create story" }))
          throw new Error(error.error || "Failed to create story")
        }

        const createdStory = await response.json()
        setStories([createdStory, ...stories])
        setNewStoryTitle("")
        setNewStoryContent("")
        toast.success("Your story has been shared.")
      } catch (error) {
        console.error("Error creating story:", error)
        toast.error(error instanceof Error ? error.message : "Failed to create story. Please try again.")
      }
    }
  }

  const handleLike = async (storyId: string) => {
    try {
      const response = await fetch(`/api/stories/${storyId}/likes`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to toggle like")

      await fetchStories()
      toast.success("Like updated!")
    } catch (error) {
      console.error("[v0] Error toggling like:", error)
      toast.error("Failed to update like.")
    }
  }

  const fetchComments = async (storyId: string) => {
    try {
      const response = await fetch(`/api/stories/${storyId}/comments`)
      if (!response.ok) throw new Error("Failed to fetch comments")
      const data = await response.json()
      setComments((prev) => ({ ...prev, [storyId]: data }))
    } catch (error) {
      console.error("[v0] Error fetching comments:", error)
    }
  }

  const handleAddComment = async (storyId: string) => {
    if (!newComment.trim()) return

    try {
      const response = await fetch(`/api/stories/${storyId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })

      if (!response.ok) throw new Error("Failed to add comment")

      setNewComment("")
      await fetchComments(storyId)
      await fetchStories()
      toast.success("Comment added!")
    } catch (error) {
      console.error("[v0] Error adding comment:", error)
      toast.error(error instanceof Error ? error.message : "Failed to add comment.")
    }
  }

  const toggleComments = (storyId: string) => {
    if (selectedStory === storyId) {
      setSelectedStory(null)
    } else {
      setSelectedStory(storyId)
      if (!comments[storyId]) {
        fetchComments(storyId)
      }
    }
  }

  const handleDeleteStory = async (storyId: string) => {
    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete story")
      }

      setStories(stories.filter((story) => story.id !== storyId))
      toast.success("Story deleted successfully!")
    } catch (error) {
      console.error("[v0] Error deleting story:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete story.")
    }
  }

  const handleDeleteComment = async (storyId: string, commentId: string) => {
    try {
      const response = await fetch(`/api/stories/${storyId}/comments/${commentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete comment")
      }

      await fetchComments(storyId)
      await fetchStories()
      toast.success("Comment deleted successfully!")
    } catch (error) {
      console.error("[v0] Error deleting comment:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete comment.")
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-green-500 text-lg md:text-xl">Share Your Story</CardTitle>
          <p className="text-sm text-gray-400 mt-2">Share your experiences, ideas, and updates with your team</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleNewStory} className="space-y-4">
            <Input
              type="text"
              placeholder="Story title..."
              value={newStoryTitle}
              onChange={(e) => setNewStoryTitle(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Textarea
              placeholder="What's your story? Share your thoughts, progress, or any updates..."
              value={newStoryContent}
              onChange={(e) => setNewStoryContent(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
            />
            <Button type="submit" className="bg-green-500 hover:bg-green-600">
              Share Story
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {stories.map((story) => (
          <Card key={story.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{story.author.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base md:text-lg text-white truncate">{story.title}</CardTitle>
                    <p className="text-xs md:text-sm text-gray-400 truncate">
                      {story.author.name || story.author.email}
                    </p>
                  </div>
                </div>
                {user?.id === story.author.id && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-800 border-gray-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          This action cannot be undone. This will permanently delete your story and all its comments.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteStory(story.id)}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm md:text-base text-gray-300 mb-4">{story.content}</p>

              <div className="flex items-center space-x-2 md:space-x-4 border-t border-gray-700 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(story.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  {story._count?.likes || 0}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleComments(story.id)}
                  className="text-gray-400 hover:text-green-500"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {story._count?.comments || 0}
                </Button>
              </div>

              {selectedStory === story.id && (
                <div className="mt-4 space-y-3 border-t border-gray-700 pt-4">
                  {comments[story.id]?.map((comment) => (
                    <div key={comment.id} className="flex space-x-2">
                      <Avatar className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0">
                        <AvatarFallback>{comment.author.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-gray-700 rounded-lg p-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs md:text-sm text-gray-400 truncate">
                            {comment.author.name || comment.author.email}
                          </p>
                          {user?.id === comment.authorId && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-gray-400 hover:text-red-500"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-gray-800 border-gray-700">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-white">Delete Comment?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-400">
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteComment(story.id, comment.id)}
                                    className="bg-red-600 text-white hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                        <p className="text-sm text-white">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Input
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white flex-1"
                      onKeyPress={(e) => e.key === "Enter" && handleAddComment(story.id)}
                    />
                    <Button
                      size="icon"
                      onClick={() => handleAddComment(story.id)}
                      className="bg-green-500 hover:bg-green-600 w-full sm:w-auto"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
