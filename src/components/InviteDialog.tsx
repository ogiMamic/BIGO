"use client";

import { useState } from "react";
import { Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteDialog({ isOpen, onClose }: InviteDialogProps) {
  const [emails, setEmails] = useState("");
  const inviteLink = "https://invite.evidanzabigo.com/wfyuihsrdbbh6seq3f"; // Updated domain

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
  };

  const handleSendInvites = () => {
    // Handle sending invites
    console.log("Sending invites to:", emails.split("\n"));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white rounded-xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Invite people to Bigo
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Share a link</Label>
            <div className="flex items-center space-x-2">
              <Input
                readOnly
                value={inviteLink}
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
              <Button
                variant="secondary"
                size="icon"
                onClick={copyLink}
                className="shrink-0 bg-gray-700 hover:bg-gray-600"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-gray-300">
                Send invitation emails
              </Label>
              <Button
                variant="link"
                className="text-blue-400 hover:text-blue-300 p-0 h-auto"
              >
                Personalize
              </Button>
            </div>
            <Textarea
              placeholder="Enter email addresses (one per line)"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              className="h-[100px] bg-gray-700 border-gray-600 text-gray-200 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              className="bg-gray-700 hover:bg-gray-600 border-gray-600 text-white"
            >
              Import from Slack
            </Button>
            <Button
              onClick={handleSendInvites}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Send invitations
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
