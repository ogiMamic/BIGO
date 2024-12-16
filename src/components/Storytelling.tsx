"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Comment {
  id: string;
  author: {
    name: string;
  };
  content: string;
  createdAt: string;
}

interface Story {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  comments: Comment[];
  likes: number;
  isLikedByUser: boolean;
  team: {
    id: string;
    name: string;
  };
  storytelling: {
    id: string;
    title: string;
  };
}

interface Team {
  id: string;
  name: string;
}

interface Storytelling {
  id: string;
  title: string;
}

export default function Storytelling() {
  const [activeStorytellingId, setActiveStorytellingId] = useState<
    string | null
  >(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [newStory, setNewStory] = useState("");
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [storytellings, setStorytellings] = useState<Storytelling[]>([]);

  useEffect(() => {
    fetchStorytellings();
  }, []);

  useEffect(() => {
    if (activeStorytellingId) {
      fetchStories(activeStorytellingId);
    }
  }, [activeStorytellingId]);

  const fetchStorytellings = async () => {
    try {
      const response = await fetch("/api/storytellings");
      if (!response.ok) {
        throw new Error("Failed to fetch storytellings");
      }
      const data = await response.json();
      setStorytellings(data);
      if (data.length > 0) {
        setActiveStorytellingId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching storytellings:", error);
      toast.error("Failed to fetch storytellings. Please try again later.");
    }
  };

  const fetchStories = async (storytellingId: string) => {
    try {
      const response = await fetch(
        `/api/stories?storytellingId=${storytellingId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch stories");
      }
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error("Error fetching stories:", error);
      toast.error("Failed to fetch stories. Please try again later.");
    }
  };

  const handleNewStory = async () => {
    if (newStory.trim() && activeStorytellingId) {
      try {
        const response = await fetch("/api/stories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newStory,
            content: newStory,
            storytellingId: activeStorytellingId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create story");
        }

        const createdStory = await response.json();
        setStories([createdStory, ...stories]);
        setNewStory("");
        toast.success("Your story has been shared.");
      } catch (error) {
        console.error("Error creating story:", error);
        toast.error("Failed to create story. Please try again.");
      }
    }
  };

  const handleNewComment = async (storyId: string) => {
    if (newComments[storyId]?.trim()) {
      try {
        const response = await fetch(`/api/stories/${storyId}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newComments[storyId],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create comment");
        }

        const createdComment = await response.json();
        const updatedStories = stories.map((story) => {
          if (story.id === storyId) {
            return {
              ...story,
              comments: [createdComment, ...story.comments],
            };
          }
          return story;
        });
        setStories(updatedStories);
        setNewComments({ ...newComments, [storyId]: "" });
        toast.success("Your comment has been added.");
      } catch (error) {
        console.error("Error creating comment:", error);
        toast.error("Failed to add comment. Please try again.");
      }
    }
  };

  return (
    <div className="flex-1 flex-col h-screen bg-gray-900 text-white">
      <header className="p-4 bg-gray-800 rounded-b-2xl shadow-md">
        <h1 className="text-2xl font-bold text-green-500">STORYTELLING</h1>
      </header>
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 flex justify-between items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-gray-700 text-white border-gray-600 rounded-full"
              >
                {storytellings.find((s) => s.id === activeStorytellingId)
                  ?.title || "Select Storytelling"}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-700 text-white border-gray-600 rounded-xl">
              {storytellings.map((storytelling) => (
                <DropdownMenuItem
                  key={storytelling.id}
                  onSelect={() => setActiveStorytellingId(storytelling.id)}
                  className="hover:bg-gray-600 rounded-lg"
                >
                  {storytelling.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex-1 ml-4 flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Share a story..."
              value={newStory}
              onChange={(e) => setNewStory(e.target.value)}
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-full focus:ring-2 focus:ring-green-500"
            />
            <Button
              onClick={handleNewStory}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4"
            >
              <Send className="h-5 w-5 mr-2" />
              Share
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {stories.map((story) => (
              <Card
                key={story.id}
                className="bg-gray-800 border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="flex flex-row items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${story.author.name}`}
                    />
                    <AvatarFallback>{story.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-green-500">
                      {story.title}
                    </CardTitle>
                    <p className="text-sm text-gray-400">
                      {story.author.name} | {story.team.name}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{story.content}</p>
                  <div className="space-y-2">
                    {story.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gray-700 p-3 rounded-xl"
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <Avatar className="w-6 h-6">
                            <AvatarImage
                              src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.author.name}`}
                            />
                            <AvatarFallback>
                              {comment.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-semibold">
                            {comment.author.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComments[story.id] || ""}
                      onChange={(e) =>
                        setNewComments({
                          ...newComments,
                          [story.id]: e.target.value,
                        })
                      }
                      className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-full focus:ring-2 focus:ring-green-500"
                    />
                    <Button
                      onClick={() => handleNewComment(story.id)}
                      className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
