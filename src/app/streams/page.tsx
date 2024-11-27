"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function StreamsPage() {
  const [streams, setStreams] = useState([]);
  const [newStream, setNewStream] = useState("");
  const [newStory, setNewStory] = useState({ streamIndex: -1, title: "" });

  const addStream = () => {
    if (newStream.trim()) {
      setStreams([...streams, { name: newStream, stories: [] }]);
      setNewStream("");
    }
  };

  const addStory = () => {
    if (newStory.title.trim() && newStory.streamIndex !== -1) {
      const updatedStreams = [...streams];
      updatedStreams[newStory.streamIndex].stories.push({
        title: newStory.title,
      });
      setStreams(updatedStreams);
      setNewStory({ streamIndex: -1, title: "" });
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Streams</h1>
      <div className="flex mb-4">
        <Input
          value={newStream}
          onChange={(e) => setNewStream(e.target.value)}
          placeholder="New stream name"
          className="mr-2"
        />
        <Button onClick={addStream}>Add Stream</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {streams.map((stream, streamIndex) => (
          <Card key={streamIndex}>
            <CardHeader>
              <CardTitle>{stream.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{stream.stories.length} stories</p>
              <ul className="mt-2">
                {stream.stories.map((story, storyIndex) => (
                  <li key={storyIndex}>{story.title}</li>
                ))}
              </ul>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-2">Add Story</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a new story to {stream.name}</DialogTitle>
                  </DialogHeader>
                  <Input
                    value={newStory.title}
                    onChange={(e) =>
                      setNewStory({ streamIndex, title: e.target.value })
                    }
                    placeholder="Story title"
                    className="mb-2"
                  />
                  <Button onClick={addStory}>Add Story</Button>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
