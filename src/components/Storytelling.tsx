"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast, Toaster } from "sonner";
import StorySidebar from "./StorySidebar";
import StoryList from "./StoryList";
import CreateStoryModal from "./CreateStoryModal";
import CreateStorytellingModal from "./CreateStorytellingModal";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCcw } from "lucide-react";

interface Storytelling {
  id: string;
  title: string;
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
  likes: number;
  comments: Comment[];
  isLikedByUser: boolean;
}

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export default function Storytelling() {
  const { user } = useUser();
  const [storytellings, setStorytellings] = useState<Storytelling[]>([]);
  const [selectedStorytelling, setSelectedStorytelling] = useState<
    string | null
  >(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
  const [isCreateStorytellingModalOpen, setIsCreateStorytellingModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchStorytellings();
    }
  }, [user]);

  useEffect(() => {
    if (selectedStorytelling) {
      fetchStories(selectedStorytelling);
    }
  }, [selectedStorytelling]);

  const fetchStorytellings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/storytellings");
      if (!response.ok) {
        throw new Error("Failed to fetch storytellings");
      }
      const data = await response.json();
      setStorytellings(data);
      if (data.length > 0) {
        setSelectedStorytelling(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching storytellings:", error);
      setError("Failed to fetch storytellings. Please try again.");
      toast.error("Failed to fetch storytellings. Please try again.", {
        style: { background: "#333", color: "#fff" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStories = async (storytellingId: string) => {
    try {
      setIsLoading(true);
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
      toast.error("Failed to fetch stories. Please try again.", {
        style: { background: "#333", color: "#fff" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStorytelling = async (title: string) => {
    try {
      const response = await fetch("/api/storytellings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Failed to create storytelling");
      }

      const newStorytelling = await response.json();
      setStorytellings((prev) => [...prev, newStorytelling]);
      setSelectedStorytelling(newStorytelling.id);
      setIsCreateStorytellingModalOpen(false);
      toast.success("Storytelling created successfully!", {
        style: { background: "#333", color: "#fff" },
      });
    } catch (error) {
      console.error("Error creating storytelling:", error);
      toast.error("Failed to create storytelling. Please try again.", {
        style: { background: "#333", color: "#fff" },
      });
    }
  };

  const handleCreateStory = async (title: string, content: string) => {
    if (!title.trim() || !content.trim() || !user || !selectedStorytelling) {
      toast.error(
        "Please enter a title and content for your story, ensure you're logged in, and a storytelling is selected.",
        { style: { background: "#333", color: "#fff" } }
      );
      return;
    }

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          storytellingId: selectedStorytelling,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create story");
      }

      const newStory = await response.json();
      setStories((prevStories) => [newStory, ...prevStories]);
      setIsCreateStoryModalOpen(false);
      toast.success("Story created successfully!", {
        style: { background: "#333", color: "#fff" },
      });
    } catch (error) {
      console.error("Error creating story:", error);
      toast.error(
        `Failed to create story: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { style: { background: "#333", color: "#fff" } }
      );
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete story");
      }

      setStories((prevStories) =>
        prevStories.filter((story) => story.id !== storyId)
      );
      toast.success("Story deleted successfully", {
        style: { background: "#333", color: "#fff" },
      });
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Failed to delete story. Please try again.", {
        style: { background: "#333", color: "#fff" },
      });
    }
  };

  const handleLikeStory = (
    storyId: string,
    newLikeCount: number,
    isLiked: boolean
  ) => {
    setStories((prevStories) =>
      prevStories.map((story) =>
        story.id === storyId
          ? { ...story, likes: newLikeCount, isLikedByUser: isLiked }
          : story
      )
    );
  };

  const handleCommentStory = async (storyId: string, content: string) => {
    try {
      const response = await fetch(`/api/stories/${storyId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newComment = await response.json();
      setStories((prevStories) =>
        prevStories.map((story) =>
          story.id === storyId
            ? { ...story, comments: [...story.comments, newComment] }
            : story
        )
      );
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again.", {
        style: { background: "#333", color: "#fff" },
      });
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <p className="bg-gray-800 p-4 rounded-lg">
          Please sign in to access Storytelling.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <Toaster />
      <StorySidebar>
        <div className="space-y-2 p-4">
          <Button
            onClick={() => setIsCreateStorytellingModalOpen(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            New Storytelling
          </Button>
          {storytellings.map((storytelling) => (
            <Button
              key={storytelling.id}
              onClick={() => setSelectedStorytelling(storytelling.id)}
              className={`w-full text-left ${
                selectedStorytelling === storytelling.id
                  ? "bg-gray-700"
                  : "bg-gray-800"
              } hover:bg-gray-700`}
            >
              {storytelling.title}
            </Button>
          ))}
          {error && (
            <Button
              onClick={fetchStorytellings}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center"
            >
              <RefreshCcw className="h-5 w-5 mr-2" />
              Retry
            </Button>
          )}
        </div>
      </StorySidebar>
      <div className="flex-1 flex flex-col bg-gray-800 p-4 rounded-lg overflow-hidden">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-green-500 bg-gray-700 px-3 py-1 rounded-lg">
            {selectedStorytelling
              ? storytellings.find((s) => s.id === selectedStorytelling)
                  ?.title || "Stories"
              : "Select a Storytelling"}
          </h2>
          <Button
            onClick={() => setIsCreateStoryModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center"
            disabled={!selectedStorytelling}
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            New Story
          </Button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400 bg-gray-700 p-4 rounded-lg">
              Loading...
            </p>
          </div>
        ) : stories.length > 0 ? (
          <div className="flex-1 overflow-y-auto pr-2">
            <StoryList
              stories={stories}
              onDeleteStory={handleDeleteStory}
              onLikeStory={handleLikeStory}
              onCommentStory={handleCommentStory}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400 bg-gray-700 p-4 rounded-lg">
              No stories found. Create a new story to get started!
            </p>
          </div>
        )}
      </div>

      <CreateStoryModal
        isOpen={isCreateStoryModalOpen}
        onClose={() => setIsCreateStoryModalOpen(false)}
        onCreateStory={handleCreateStory}
      />

      <CreateStorytellingModal
        isOpen={isCreateStorytellingModalOpen}
        onClose={() => setIsCreateStorytellingModalOpen(false)}
        onCreateStorytelling={handleCreateStorytelling}
      />
    </div>
  );
}
