"use client";

import { useState } from "react";
import { Search, Paperclip, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const users = [
  {
    id: 1,
    name: "Dominik Lamakani",
    avatar: "/placeholder.svg?height=32&width=32",
    unreadCount: 2,
  },
  {
    id: 2,
    name: "Tisha Yanchev",
    avatar: "/placeholder.svg?height=32&width=32",
    unreadCount: 4,
  },
  {
    id: 3,
    name: "Jerzy Wierzy",
    avatar: "/placeholder.svg?height=32&width=32",
    unreadCount: 1,
  },
  {
    id: 4,
    name: "Adrian Przetocki",
    avatar: "/placeholder.svg?height=32&width=32",
    unreadCount: 0,
  },
  {
    id: 5,
    name: "Simona Lürwer",
    avatar: "/placeholder.svg?height=32&width=32",
    unreadCount: 0,
  },
];

const channels = ["#New Leads", "#Development Team", "#Product Tips"];

const initialMessages = [
  {
    id: 1,
    sender: "Dominik Lamakani",
    content: "What do you think? Duis aute irure dolor in reprehenderit 🔥",
    time: "2:48 PM",
    isSent: false,
  },
  {
    id: 2,
    sender: "You",
    content:
      "Sed euismod nisi porta lorem mollis. Tellus elementum sagittis vitae et leo duis. Viverra justo nec ultrices dui. Sed lectus vestibulum mattis ullamcorper velit sed. Ut sem nulla pharetra diam sit amet 🇫🇷",
    time: "2:55 PM",
    isSent: true,
  },
  {
    id: 3,
    sender: "You",
    content: "Can you join @dominik? https://meet.google.com/haz-r3gt-idj",
    time: "10:15 AM",
    isSent: true,
  },
];

export default function DirectMessages() {
  const [activeConversation, setActiveConversation] = useState("Marketing");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: "You",
        content: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSent: true,
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Conversations list */}
      <div className="w-64 border-r border-gray-700 flex flex-col bg-gray-800 rounded-l-2xl">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-lg font-semibold text-green-500">
              #{activeConversation}
            </h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-full w-full"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
              Direct Messages
            </h3>
            <ul className="space-y-2">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="flex-1 truncate text-sm">{user.name}</span>
                  {user.unreadCount > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {user.unreadCount}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
              Channels
            </h3>
            <ul className="space-y-2">
              {channels.map((channel) => (
                <li
                  key={channel}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                >
                  <span className="text-gray-400 text-sm">#</span>
                  <span className="flex-1 truncate text-sm">
                    {channel.slice(1)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col rounded-r-2xl">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-green-500">
            #{activeConversation}
          </h2>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isSent ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                    message.isSent ? "bg-green-500" : "bg-gray-700"
                  } rounded-2xl p-3 shadow-md`}
                >
                  {!message.isSent && (
                    <p className="font-semibold mb-1 text-sm">
                      {message.sender}
                    </p>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-1 text-right text-gray-300">
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-full focus:ring-2 focus:ring-green-500"
            />
            <Button
              size="icon"
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleSendMessage}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4"
            >
              <Send className="h-5 w-5 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
