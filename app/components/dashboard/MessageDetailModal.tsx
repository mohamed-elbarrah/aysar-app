"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, Loader2, Mail, Phone, Calendar, MessageSquare, AlertTriangle } from "lucide-react";

interface ContactMsg {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: "new" | "read";
}

interface MessageDetailModalProps {
  message: ContactMsg;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkRead: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-red-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function MessageDetailModal({
  message,
  open,
  onOpenChange,
  onMarkRead,
  onDelete,
}: MessageDetailModalProps) {
  const [marking, setMarking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleMarkRead = async () => {
    setMarking(true);
    await onMarkRead(message.id);
    setMarking(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(message.id);
    setDeleting(false);
    onOpenChange(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border border-[#e8edf5] shadow-xl rounded-2xl">
        {showDeleteConfirm ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <DialogTitle className="text-lg text-red-700">Delete Message</DialogTitle>
                </div>
              </div>
            </DialogHeader>

            <div className="py-6">
              <p className="text-[#0c2954] mb-2">
                Are you sure you want to delete this message from <strong>{message.name}</strong>?
              </p>
              <p className="text-sm text-[#6b7a94]">
                This action cannot be undone. The message will be permanently removed from the database.
              </p>
            </div>

            <DialogFooter className="gap-2">
              <DashboardButton
                variant="secondary"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </DashboardButton>
              <DashboardButton
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
                ) : (
                  <><Trash2 className="w-4 h-4" /> Delete</>
                )}
              </DashboardButton>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-full ${getAvatarColor(
                    message.name
                  )} flex items-center justify-center text-white font-bold text-lg shrink-0`}
                >
                  {getInitials(message.name)}
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-xl text-[#0c2954] mb-1">
                    {message.name}
                  </DialogTitle>
                  <div className="flex items-center gap-2">
                    {message.status === "new" ? (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">New</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-600 border-gray-200">Read</Badge>
                    )}
                    <span className="text-sm text-[#6b7a94]">
                      {formatDate(message.date)} at {formatTime(message.date)}
                    </span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-5 py-2">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-[#6b7a94]" />
                  <div>
                    <p className="text-xs text-[#6b7a94]">Email</p>
                    <p className="text-sm text-[#0c2954] font-medium">{message.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-[#6b7a94]" />
                  <div>
                    <p className="text-xs text-[#6b7a94]">Phone</p>
                    <p className="text-sm text-[#0c2954] font-medium">{message.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-[#6b7a94]" />
                  <div>
                    <p className="text-xs text-[#6b7a94]">Inquiry Type</p>
                    <p className="text-sm text-[#0c2954] font-medium">{message.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-[#6b7a94]" />
                  <div>
                    <p className="text-xs text-[#6b7a94]">Received</p>
                    <p className="text-sm text-[#0c2954] font-medium">{formatDate(message.date)}</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-[#6b7a94]" />
                  <p className="text-sm font-semibold text-[#3a4a60]">Message</p>
                </div>
                <div className="bg-white border border-[#e8edf5] rounded-xl p-4 shadow-sm">
                  <p className="text-[#0c1829] whitespace-pre-wrap leading-relaxed">
                    {message.message}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              {message.status === "new" && (
                <DashboardButton
                  variant="primary"
                  size="sm"
                  onClick={handleMarkRead}
                  disabled={marking}
                >
                  {marking ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Marking...</>
                  ) : (
                    <><Eye className="w-4 h-4" /> Mark as Read</>
                  )}
                </DashboardButton>
              )}
              <DashboardButton
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4" /> Delete
              </DashboardButton>
              <DialogClose className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer">
                Close
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
