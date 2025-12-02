"use client"

import { useState, useEffect } from "react"
import { Search, Send } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"

interface User {
  id: string
  name: string | null
  email: string
}

interface DirectMessage {
  id: string
  content: string
  sender: User
  recipient: User
  createdAt: string
}

export default function DirectMessages() {
  const { user } = useUser()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<DirectMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id)
      const interval = setInterval(() => fetchMessages(selectedUser.id), 3000) // Auto-refresh every 3 seconds
      return () => clearInterval(interval)
    }
  }, [selectedUser])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error("Failed to fetch users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("[v0] Error fetching users:", error)
      toast.error("Failed to load users")
    }
  }

  const fetchMessages = async (recipientId: string) => {
    try {
      const response = await fetch(`/api/messages/direct?recipientId=${recipientId}`)
      if (!response.ok) throw new Error("Failed to fetch messages")
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error("[v0] Error fetching messages:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return

    try {
      const response = await fetch("/api/messages/direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          recipientId: selectedUser.id,
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      setNewMessage("")
      await fetchMessages(selectedUser.id)
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      toast.error("Failed to send message")
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Users list */}
      <div className="w-64 border-r border-gray-700 flex flex-col bg-gray-800 rounded-l-2xl">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-green-500 mb-4">Direct Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-full w-full"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-4 py-2">
            <ul className="space-y-2">
              {filteredUsers.map((u) => (
                <li
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  className={`flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-700 cursor-pointer transition-colors duration-200 ${
                    selectedUser?.id === u.id ? "bg-gray-700" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{u.name?.[0] || u.email[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="flex-1 truncate text-sm">{u.name || u.email}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col rounded-r-2xl">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-green-500">{selectedUser.name || selectedUser.email}</h2>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isSent = message.sender.id === user?.id
                  return (
                    <div key={message.id} className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                          isSent ? "bg-green-500" : "bg-gray-700"
                        } rounded-2xl p-3 shadow-md`}
                      >
                        {!isSent && (
                          <p className="font-semibold mb-1 text-sm">{message.sender.name || message.sender.email}</p>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 text-right text-gray-300">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })}
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
                  onClick={handleSendMessage}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">Select a user to start messaging</div>
        )}
      </div>
    </div>
  )
}
