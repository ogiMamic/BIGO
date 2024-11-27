import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface StoryInputProps {
  onSendStory: (story: string) => void;
}

export default function StoryInput({ onSendStory }: StoryInputProps) {
  const [newStory, setNewStory] = useState("");

  const handleSend = () => {
    if (newStory.trim()) {
      onSendStory(newStory);
      setNewStory("");
    }
  };

  return (
    <div className="mt-4 bg-gray-700 rounded-lg p-2">
      <Textarea
        value={newStory}
        onChange={(e) => setNewStory(e.target.value)}
        placeholder="Share your story..."
        className="w-full bg-gray-600 text-white border-gray-500 rounded-lg focus:ring-green-500 focus:border-green-500 mb-2"
        rows={3}
      />
      <Button
        onClick={handleSend}
        className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center"
      >
        <Send className="h-5 w-5 mr-2" />
        Share Story
      </Button>
    </div>
  );
}
