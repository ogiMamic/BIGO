import { StoryCard } from "./StoryCard";

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

interface StoryListProps {
  stories: Story[];
  onDeleteStory: (id: string) => void;
  onLikeStory: (id: string, newLikeCount: number, isLiked: boolean) => void;
  onCommentStory: (id: string, content: string) => void;
}

export default function StoryList({
  stories,
  onDeleteStory,
  onLikeStory,
  onCommentStory,
}: StoryListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          story={story}
          onDelete={onDeleteStory}
          onLike={onLikeStory}
          onComment={onCommentStory}
        />
      ))}
    </div>
  );
}
