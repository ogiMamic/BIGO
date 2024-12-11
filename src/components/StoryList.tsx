import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Story {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  createdAt: string;
}

interface StoryListProps {
  stories: Story[];
}

export default function StoryList({ stories }: StoryListProps) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {stories.map((story) => (
          <div key={story.id} className="bg-gray-800 rounded-xl p-4 shadow-md">
            <div className="flex items-center space-x-2 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt={story.author.name} />
                <AvatarFallback>{story.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{story.author.name}</p>
                <p className="text-xs text-gray-400">
                  {new Date(story.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-sm">{story.content}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
