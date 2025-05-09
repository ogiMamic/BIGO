"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Story {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
}

export default function Storytelling() {
  const [stories, setStories] = useState<Story[]>([]);
  const [newStory, setNewStory] = useState("");

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch("/api/stories");
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

  const handleNewStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newStory.trim()) {
      try {
        const response = await fetch("/api/stories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newStory, content: newStory }),
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

  return (
    <div className="space-y-4">
      <form onSubmit={handleNewStory} className="space-y-2">
        <Input
          type="text"
          placeholder="Share a story..."
          value={newStory}
          onChange={(e) => setNewStory(e.target.value)}
        />
        <Button type="submit">Share Story</Button>
      </form>
      <div className="space-y-4">
        {stories.map((story) => (
          <Card key={story.id}>
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{story.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                By: {story.author.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
