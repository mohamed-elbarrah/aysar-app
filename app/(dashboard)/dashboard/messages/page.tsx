"use client";

import { useState, useEffect } from "react";
import { Input } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { Search, RotateCcw, Eye, Trash2, Loader2 } from "lucide-react";

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

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "new" | "read">("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/contact-messages", { credentials: "include" });
        const json = await res.json();
        if (json.success) setMessages(json.data);
      } catch { /* keep empty */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const filtered = messages.filter((m) => {
    const matchesSearch =
      !search || m.name.includes(search) || m.email.includes(search) || m.phone.includes(search);
    const matchesType = !typeFilter || m.type === typeFilter;
    const matchesStatus = !statusFilter || m.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const markAsRead = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "read" as const } : m)));
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const statusBadge = (status: string) => {
    const styles = {
      new: "bg-blue-100 text-blue-700",
      read: "bg-green-100 text-green-700",
    };
    const labels = { new: "جديد", read: "مقروء" };
    return (
      <Badge className={styles[status as keyof typeof styles] || ""}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83] mx-auto mb-3" />
          <p className="text-sm text-[#6b7a94]">جارٍ تحميل الرسائل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ContentCard title="فلترة الرسائل">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            label="بحث"
            placeholder="بحث: اسم، جوال، بريد..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            wrapperClassName="max-w-[280px] !mb-0"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 rounded-xl border border-[#e8edf5] bg-white px-3 text-sm outline-none focus:border-[#2d2e83] focus:ring-2 focus:ring-[#2d2e83]/10 transition-all"
          >
            <option value="">الكل</option>
            <option value="طلب عرض تجريبي">طلب عرض تجريبي</option>
            <option value="استفسار عن الأسعار">استفسار عن الأسعار</option>
            <option value="دعم فني">دعم فني</option>
            <option value="شراكة أو تعاون">شراكة أو تعاون</option>
            <option value="أخرى">أخرى</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "")}
            className="h-10 rounded-xl border border-[#e8edf5] bg-white px-3 text-sm outline-none focus:border-[#2d2e83] focus:ring-2 focus:ring-[#2d2e83]/10 transition-all"
          >
            <option value="">الكل</option>
            <option value="new">جديد</option>
            <option value="read">مقروء</option>
          </select>
          <DashboardButton variant="secondary" size="sm" onClick={() => { setSearch(""); setTypeFilter(""); setStatusFilter(""); }}>
            <RotateCcw className="w-4 h-4" />
            إعادة
          </DashboardButton>
          <DashboardButton size="sm">
            <Search className="w-4 h-4" />
            بحث
          </DashboardButton>
        </div>
      </ContentCard>

      <p className="text-sm text-[#6b7a94]">نتيجة {filtered.length}</p>

      <ContentCard title="الطلبات — الأحدث أولاً">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right">الجوال</TableHead>
                <TableHead className="text-right">الرسالة</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell>
                    <Badge variant="outline">{msg.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{msg.name}</p>
                      <p className="text-xs text-[#6b7a94]">{msg.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{msg.phone}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{msg.message}</TableCell>
                  <TableCell>
                    {new Date(msg.date).toLocaleDateString("ar-SA")}
                    <br />
                    <span className="text-xs text-[#6b7a94]">
                      {new Date(msg.date).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </TableCell>
                  <TableCell>{statusBadge(msg.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DashboardButton
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => markAsRead(msg.id)}
                        disabled={msg.status !== "new"}
                      >
                        <Eye className="w-4 h-4" />
                      </DashboardButton>
                      <DashboardButton
                        variant="danger"
                        size="icon-sm"
                        onClick={() => deleteMessage(msg.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </DashboardButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-[#6b7a94]">
                    لا توجد رسائل
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ContentCard>
    </div>
  );
}
