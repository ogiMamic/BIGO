"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Send, Bell, BellOff } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"
import {
  requestNotificationPermission,
  sendBrowserNotification,
  checkNotificationSupport,
} from "@/lib/push-notifications"

interface User {
  id: string
  name: string | null
  email: string
  teams?: { id: string; name: string }[]
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
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const previousMessagesCount = useRef(0)

  useEffect(() => {
    const syncUserData = async () => {
      try {
        await fetch("/api/users", { method: "POST" })
      } catch (error) {
        console.error("Failed to sync user data:", error)
      }
    }

    syncUserData()
    fetchUsers()

    if (checkNotificationSupport()) {
      setNotificationsEnabled(Notification.permission === "granted")
    }

    const interval = setInterval(fetchUsers, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id)
      const interval = setInterval(() => fetchMessages(selectedUser.id), 3000)
      return () => clearInterval(interval)
    }
  }, [selectedUser])

  useEffect(() => {
    if (messages.length > previousMessagesCount.current && previousMessagesCount.current > 0) {
      const newMessages = messages.slice(previousMessagesCount.current)
      newMessages.forEach((msg) => {
        if (msg.sender.id !== user?.id && notificationsEnabled) {
          sendBrowserNotification(`New message from ${msg.sender.name || msg.sender.email}`, {
            body: msg.content,
            tag: `message-${msg.id}`,
          })
        }
      })
    }
    previousMessagesCount.current = messages.length
  }, [messages, user?.id, notificationsEnabled])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error("Failed to fetch users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
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
      console.error("Error fetching messages:", error)
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
      console.error("Error sending message:", error)
      toast.error("Failed to send message")
    }
  }

  const handleToggleNotifications = async () => {
    if (!checkNotificationSupport()) {
      toast.error("Your browser doesn't support notifications")
      return
    }

    if (notificationsEnabled) {
      setNotificationsEnabled(false)
      toast.info("Notifications disabled")
    } else {
      const permission = await requestNotificationPermission()
      if (permission === "granted") {
        setNotificationsEnabled(true)
        toast.success("Notifications enabled")
      } else {
        toast.error("Notification permission denied")
      }
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] md:h-screen bg-gray-900 text-white overflow-hidden">
      <div className="w-full md:w-80 border-b md:border-r border-gray-700 flex flex-col bg-gray-800 md:rounded-l-2xl max-h-48 md:max-h-none">
        <div className="p-3 md:p-4">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h2 className="text-base md:text-lg font-semibold text-green-500">Direct Messages</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleNotifications}
              className="h-8 w-8"
              title={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
            >
              {notificationsEnabled ? (
                <Bell className="h-4 w-4 text-green-500" />
              ) : (
                <BellOff className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-400 mb-3 hidden md:block">Send private messages to team members</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-full w-full text-sm"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-3 md:px-4 py-2">
            <ul className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {filteredUsers.map((u) => (
                <li
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  className={`flex items-center space-x-2 md:space-x-3 p-2 rounded-xl hover:bg-gray-700 cursor-pointer transition-colors duration-200 flex-shrink-0 min-w-[80px] md:min-w-0 ${
                    selectedUser?.id === u.id ? "bg-gray-700" : ""
                  }`}
                >
                  <Avatar className="h-9 w-9 md:h-10 md:w-10">
                    <AvatarFallback className="text-sm md:text-base">
                      {u.name?.[0] || u.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col flex-1 min-w-0">
                    <span className="truncate text-sm font-medium">{u.name || u.email}</span>
                    {u.teams && u.teams.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {u.teams.slice(0, 2).map((team) => (
                          <Badge
                            key={team.id}
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 bg-green-500/20 text-green-400 border-0"
                          >
                            {team.name}
                          </Badge>
                        ))}
                        {u.teams.length > 2 && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 bg-gray-600 text-gray-300 border-0"
                          >
                            +{u.teams.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col md:rounded-r-2xl min-h-0">
        {selectedUser ? (
          <>
            <div className="p-3 md:p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 md:h-12 md:w-12">
                  <AvatarFallback className="text-base md:text-lg">
                    {selectedUser.name?.[0] || selectedUser.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base md:text-lg font-semibold text-green-500 truncate">
                    {selectedUser.name || selectedUser.email}
                  </h2>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 p-3 md:p-4">
              <div className="space-y-3 md:space-y-4">
                {messages.map((message) => {
                  const isSent = message.sender.id === user?.id
                  return (
                    <div key={message.id} className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] sm:max-w-xs md:max-w-md lg:max-w-lg ${
                          isSent ? "bg-green-500" : "bg-gray-700"
                        } rounded-2xl p-2 md:p-3 shadow-md`}
                      >
                        {!isSent && (
                          <p className="font-semibold mb-1 text-xs md:text-sm truncate">
                            {message.sender.name || message.sender.email}
                          </p>
                        )}
                        <p className="text-xs md:text-sm break-words">{message.content}</p>
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
            <div className="p-3 md:p-4 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-full focus:ring-2 focus:ring-green-500 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full px-3 md:px-4"
                  size="sm"
                >
                  <Send className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Send</span>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm md:text-base p-4 text-center">
            Select a user to start messaging
          </div>
        )}
      </div>
    </div>
  )
}
