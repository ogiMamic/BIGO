import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Heart, Trash2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface StoryCardProps {
  story: {
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
  };
  onDelete: (id: string) => void;
  onLike: (id: string, newLikeCount: number, isLiked: boolean) => void;
  onComment: (id: string, content: string) => void;
}

export function StoryCard({
  story,
  onDelete,
  onLike,
  onComment,
}: StoryCardProps) {
  const { user } = useUser();
  const [commentContent, setCommentContent] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      onDelete(story.id);
    }
  };

  const handleLike = () => {
    onLike(
      story.id,
      story.likes + (story.isLikedByUser ? -1 : 1),
      !story.isLikedByUser
    );
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentContent.trim()) {
      onComment(story.id, commentContent.trim());
      setCommentContent("");
    }
  };

  return (
    <Card className="w-full bg-gray-800 text-white border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${story.author.name}`}
              alt={story.author.name}
            />
            <AvatarFallback>{story.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base text-green-500">
              {story.title}
            </CardTitle>
            <p className="text-xs text-gray-400">
              {story.author.name} •{" "}
              {new Date(story.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {user?.id === story.author.id && (
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            className="rounded-full p-1"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete story</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm text-gray-300">{story.content}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 pt-2">
        <div className="flex justify-between w-full">
          <Button
            variant="ghost"
            onClick={handleLike}
            className={`text-xs ${
              story.isLikedByUser ? "text-red-500" : "text-gray-400"
            } hover:text-red-500 rounded-lg p-1`}
          >
            <Heart
              className={`mr-1 h-3 w-3 ${
                story.isLikedByUser ? "fill-current" : ""
              }`}
            />
            {story.likes}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowComments(!showComments)}
            className="text-xs text-gray-400 hover:text-green-500 rounded-lg p-1"
          >
            <MessageSquare className="mr-1 h-3 w-3" />
            {story.comments.length}
          </Button>
        </div>
        {showComments && (
          <div className="w-full mt-2 space-y-2">
            {story.comments.map((comment) => (
              <div key={comment.id} className="bg-gray-700 p-2 rounded-lg">
                <p className="text-xs font-semibold">{comment.author.name}</p>
                <p className="text-xs">{comment.content}</p>
              </div>
            ))}
            <form onSubmit={handleComment} className="flex gap-2">
              <Input
                type="text"
                placeholder="Add a comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="flex-1 h-8 text-xs bg-gray-700 text-white border-gray-600 rounded-lg"
              />
              <Button
                type="submit"
                className="h-8 text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg px-2"
              >
                Post
              </Button>
            </form>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
