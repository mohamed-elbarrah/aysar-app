"use client";

import { useState, useEffect } from "react";
import { Input } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { Badge } from "@/components/ui/badge";
import { MessageDetailModal } from "@/app/components/dashboard/MessageDetailModal";
import { RotateCcw, Eye, Trash2, Loader2, MessageSquare, Mail } from "lucide-react";

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

const INQUIRY_TYPES = [
  { value: "", label: "All Types" },
  { value: "demo", label: "Demo Request" },
  { value: "pricing", label: "Pricing Inquiry" },
  { value: "support", label: "Technical Support" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
];

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

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "new" | "read">("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMsg | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/contact-messages", { credentials: "include" });
        const json = await res.json();
        if (json.success && !cancelled) {
          setMessages(json.data);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = messages.filter((m) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      m.name.toLowerCase().includes(searchLower) ||
      m.email.toLowerCase().includes(searchLower) ||
      m.phone.includes(search);
    const matchesType = !typeFilter || m.type.toLowerCase().includes(typeFilter);
    const matchesStatus = !statusFilter || m.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const newCount = messages.filter((m) => m.status === "new").length;
  const readCount = messages.filter((m) => m.status === "read").length;

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/contact-messages/${id}`, {
        method: "PATCH",
        credentials: "include",
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: "read" as const } : m))
        );
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/contact-messages/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const openModal = (msg: ContactMsg) => {
    setSelectedMessage(msg);
    setModalOpen(true);
    // Auto-mark as read when opening
    if (msg.status === "new") {
      markAsRead(msg.id);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "new") {
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
          New
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100">
        Read
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      "Demo Request": "bg-purple-50 text-purple-700 border-purple-200",
      "Pricing Inquiry": "bg-green-50 text-green-700 border-green-200",
      "Technical Support": "bg-orange-50 text-orange-700 border-orange-200",
      "Partnership": "bg-indigo-50 text-indigo-700 border-indigo-200",
      Other: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return (
      <Badge className={`${colors[type] || colors.Other} text-xs`}>
        {type}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#2d2e83] mx-auto mb-4" />
          <p className="text-sm text-[#6b7a94]">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#e8edf5] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0c2954]">{messages.length}</p>
            <p className="text-xs text-[#6b7a94]">Total Messages</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#e8edf5] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0c2954]">{newCount}</p>
            <p className="text-xs text-[#6b7a94]">New</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#e8edf5] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <Eye className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0c2954]">{readCount}</p>
            <p className="text-xs text-[#6b7a94]">Read</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#e8edf5] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] max-w-[300px]">
            <Input
              label="Search"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              wrapperClassName="!mb-0"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 rounded-lg border border-[#e8edf5] bg-white px-3 text-sm outline-none focus:border-[#2d2e83] focus:ring-2 focus:ring-[#2d2e83]/10 transition-all"
            >
              {INQUIRY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "")}
              className="h-10 rounded-lg border border-[#e8edf5] bg-white px-3 text-sm outline-none focus:border-[#2d2e83] focus:ring-2 focus:ring-[#2d2e83]/10 transition-all"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <DashboardButton
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearch("");
                setTypeFilter("");
                setStatusFilter("");
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </DashboardButton>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-[#6b7a94]">
        Showing {filtered.length} of {messages.length} messages
      </p>

      {/* Messages List - Card Based */}
      <div className="space-y-3">
        {filtered.map((msg) => (
          <div
            key={msg.id}
            onClick={() => openModal(msg)}
            className={`group bg-white rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
              msg.status === "new"
                ? "border-r-4 border-r-blue-500 border-[#e8edf5] hover:border-blue-300 hover:shadow-md"
                : "border-[#e8edf5] hover:border-[#2d2e83]/30 hover:shadow-md"
            }`}
          >
            <div className="p-4 flex items-start gap-4">
              {/* Avatar */}
              <div
                className={`w-12 h-12 rounded-full ${getAvatarColor(
                  msg.name
                )} flex items-center justify-center text-white font-bold text-sm shrink-0`}
              >
                {getInitials(msg.name)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3
                    className={`font-semibold truncate ${
                      msg.status === "new" ? "text-[#0c2954]" : "text-[#3a4a60]"
                    }`}
                  >
                    {msg.name}
                  </h3>
                  <span className="text-xs text-[#6b7a94] whitespace-nowrap">
                    {formatTimeAgo(msg.date)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-[#6b7a94] truncate">{msg.email}</span>
                  <span className="text-[#e8edf5]">|</span>
                  <span className="text-sm text-[#6b7a94]">{msg.phone}</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  {getTypeBadge(msg.type)}
                  {getStatusBadge(msg.status)}
                </div>

                <p className="text-sm text-[#0c1829] line-clamp-2 leading-relaxed">
                  {msg.message}
                </p>
              </div>

              {/* Actions */}
              <div
                className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                {msg.status === "new" && (
                  <DashboardButton
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => markAsRead(msg.id)}
                    title="Mark as read"
                  >
                    <Eye className="w-4 h-4 text-blue-600" />
                  </DashboardButton>
                )}
                <DashboardButton
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => deleteMessage(msg.id)}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </DashboardButton>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-[#e8edf5] p-12 text-center">
            <Mail className="w-12 h-12 text-[#e8edf5] mx-auto mb-4" />
            <p className="text-[#6b7a94] mb-2">No messages found</p>
            <p className="text-sm text-[#6b7a94]">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedMessage && (
        <MessageDetailModal
          message={selectedMessage}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onMarkRead={markAsRead}
          onDelete={deleteMessage}
        />
      )}
    </div>
  );
}
