"use client";

import { useState } from "react";
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

const initialStories = [
  {
    id: 1,
    title: "Liquidität",
    author: "Andreas Wolf",
    department: "Finance",
    content: "Update on our current liquidity situation...",
    comments: [
      {
        id: 1,
        author: "Lisa Wagner",
        content: "Great update, thanks for sharing!",
        timestamp: "2023-06-10T10:30:00Z",
      },
      {
        id: 2,
        author: "Jerzy Wierzy",
        content: "Can we discuss this further in the next meeting?",
        timestamp: "2023-06-10T11:15:00Z",
      },
    ],
    stream: "Finance",
  },
  {
    id: 2,
    title: "Q3 Marketing Campaign",
    author: "Lisa Wagner",
    department: "Marketing",
    content: "Here's our performance chart for Q3...",
    comments: [
      {
        id: 1,
        author: "Dominik Lamakani",
        content: "The results look promising!",
        timestamp: "2023-06-11T09:00:00Z",
      },
    ],
    stream: "Marketing",
  },
  {
    id: 3,
    title: "New Product Launch",
    author: "Tisha Yanchev",
    department: "Sales",
    content: "Exciting news! We're launching our new product next month...",
    comments: [],
    stream: "Sales",
  },
];

const streams = ["Alle", "Finance", "Marketing", "Sales", "Lager & Logistik"];

export default function Storytelling() {
  const [activeStream, setActiveStream] = useState("Alle");
  const [stories, setStories] = useState(initialStories);
  const [newStory, setNewStory] = useState("");
  const [newComments, setNewComments] = useState({});

  const handleNewStory = () => {
    if (newStory.trim()) {
      const newStoryObj = {
        id: stories.length + 1,
        title: newStory,
        author: "Current User",
        department: "Your Department",
        content: newStory,
        comments: [],
        stream: activeStream === "Alle" ? "General" : activeStream,
      };
      setStories([newStoryObj, ...stories]);
      setNewStory("");
    }
  };

  const handleNewComment = (storyId) => {
    if (newComments[storyId]?.trim()) {
      const updatedStories = stories.map((story) => {
        if (story.id === storyId) {
          return {
            ...story,
            comments: [
              ...story.comments,
              {
                id: story.comments.length + 1,
                author: "Current User",
                content: newComments[storyId],
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }
        return story;
      });
      setStories(updatedStories);
      setNewComments({ ...newComments, [storyId]: "" });
    }
  };

  const filteredStories =
    activeStream === "Alle"
      ? stories
      : stories.filter((story) => story.stream === activeStream);

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
                {activeStream} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-700 text-white border-gray-600 rounded-xl">
              {streams.map((stream) => (
                <DropdownMenuItem
                  key={stream}
                  onSelect={() => setActiveStream(stream)}
                  className="hover:bg-gray-600 rounded-lg"
                >
                  {stream}
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
            {filteredStories.map((story) => (
              <Card
                key={story.id}
                className="bg-gray-800 border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="flex flex-row items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${story.author}`}
                    />
                    <AvatarFallback>{story.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-green-500">
                      {story.title}
                    </CardTitle>
                    <p className="text-sm text-gray-400">
                      {story.author} | {story.department}
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
                              src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.author}`}
                            />
                            <AvatarFallback>{comment.author[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-semibold">
                            {comment.author}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(comment.timestamp).toLocaleString()}
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
