"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Home,
  CreditCard,
  Phone,
  FileText,
  MessageCircle,
  Settings,
  Globe,
  LogOut,
  ChevronLeft,
  ChevronDown,
  User,
  type LucideIcon,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  subItems?: { href: string; label: string }[];
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  {
    href: "/dashboard/home-page",
    label: "الصفحة الرئيسية",
    icon: Home,
    subItems: [
      { href: "/dashboard/home-page#banner", label: "البانر الرئيسي" },
      { href: "/dashboard/home-page#features", label: "المميزات الرئيسية" },
      { href: "/dashboard/home-page#bento", label: "شبكة المميزات" },
      { href: "/dashboard/home-page#overview", label: "نظرة على المشروع" },
      { href: "/dashboard/home-page#app", label: "قسم التطبيق" },
      { href: "/dashboard/home-page#cta", label: "دعوة للعمل" },
    ],
  },
  {
    href: "/dashboard/plans-page",
    label: "صفحة الخطط",
    icon: CreditCard,
    subItems: [
      { href: "/dashboard/plans-page#banner", label: "البانر" },
      { href: "/dashboard/plans-page#plans", label: "الباقات" },
      { href: "/dashboard/plans-page#compare", label: "جدول المقارنة" },
      { href: "/dashboard/plans-page#faq", label: "الأسئلة الشائعة" },
    ],
  },
  {
    href: "/dashboard/contact-page",
    label: "صفحة التواصل",
    icon: Phone,
    subItems: [
      { href: "/dashboard/contact-page#banner", label: "البانر" },
      { href: "/dashboard/contact-page#form", label: "نموذج التواصل" },
      { href: "/dashboard/contact-page#channels", label: "القنوات" },
    ],
  },
  {
    href: "/dashboard/policies",
    label: "الصفحات القانونية",
    icon: FileText,
    subItems: [
      { href: "/dashboard/policies#privacy", label: "سياسة الخصوصية" },
      { href: "/dashboard/policies#terms", label: "شروط الاستخدام" },
      { href: "/dashboard/policies#return", label: "سياسة الإرجاع" },
    ],
  },
  {
    href: "/dashboard/messages",
    label: "رسائل التواصل",
    icon: MessageCircle,
    badge: 3,
  },
  {
    href: "/dashboard/settings",
    label: "الإعدادات العامة",
    icon: Settings,
    subItems: [
      { href: "/dashboard/settings/metadata", label: "معلومات الموقع" },
      { href: "/dashboard/settings/navbar", label: "شريط التنقل" },
      { href: "/dashboard/settings/footer", label: "تذييل الموقع" },
      { href: "/dashboard/settings/social", label: "وسائل التواصل" },
      { href: "/dashboard/settings/apps", label: "روابط التطبيق" },
    ],
  },
];

function NavItemComponent({
  item,
  isActive,
  isExpanded,
  onToggle,
  onNavigate,
  currentPathname,
}: {
  item: NavItem;
  isActive: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  currentPathname: string;
}) {
  const Icon = item.icon;
  const hasSubItems = !!item.subItems?.length;

  return (
    <div className="px-2">
      <div
        className={cn(
          "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 cursor-pointer select-none",
          isActive
            ? "bg-white/10 text-white font-medium"
            : "text-white/60 hover:bg-white/5 hover:text-white",
        )}
      >
        <Link
          href={item.href}
          onClick={() => {
            onNavigate();
            if (hasSubItems) onToggle();
          }}
          className="flex items-center gap-2.5 flex-1"
        >
          <Icon className="w-[18px] h-[18px]" />
          <span className="flex-1">{item.label}</span>
        </Link>
        {item.badge && (
          <Badge className="bg-[#ef4444] text-white text-[10px] h-5 min-w-[20px] px-1.5">
            {item.badge}
          </Badge>
        )}
        {hasSubItems && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle();
            }}
            className="p-0.5 rounded hover:bg-white/10 transition-colors"
          >
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-white/50 transition-transform duration-200",
                isExpanded && "rotate-180",
              )}
            />
          </button>
        )}
      </div>

      {/* Sub-items */}
      {hasSubItems && isExpanded && (
        <div className="mr-6 mt-0.5 mb-1 space-y-0.5 border-r border-white/10 pr-2">
          {item.subItems!.map((sub) => {
            const isSubActive = currentPathname === sub.href;
            return (
              <Link
                key={sub.href}
                href={sub.href}
                onClick={onNavigate}
                className={cn(
                  "block py-1.5 px-2 rounded text-xs transition-colors duration-150",
                  isSubActive
                    ? "text-[#5ddfb8] font-medium"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5",
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  {sub.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DashboardSidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    // Auto-expand the current page's section
    const s = new Set<string>();
    const active = navItems.find(
      (item) => pathname.startsWith(item.href) && item.href !== "/dashboard",
    );
    if (active?.subItems) s.add(active.href);
    return s;
  });

  // Load user data
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        const json = await res.json();
        if (json.success && json.data) {
          setUser(json.data);
        }
      } catch {
        console.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const toggleExpand = useCallback((href: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });
  }, []);

  const NavContent = (
    <div className="flex flex-col w-full justify-center h-full">
      {/* Logo */}
      <div className="w-full px-5 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-full flex justify-center">
            <Image
              src="/logo.png"
              alt="أيسَر"
              width={100}
              height={100}
              className="rounded-lg"
            />
            
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/10 mb-2" />

      {/* Nav Items */}
      <nav className="flex-1 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const isExpanded = expandedItems.has(item.href);
          return (
            <NavItemComponent
              key={item.href}
              item={item}
              isActive={isActive}
              isExpanded={isExpanded}
              onToggle={() => toggleExpand(item.href)}
              onNavigate={() => setMobileOpen(false)}
              currentPathname={pathname}
            />
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors duration-150 mb-2"
        >
          <Globe className="w-4 h-4" />
          <span className="flex-1">عرض الموقع</span>
          <ChevronLeft className="w-3 h-3" />
        </a>

        <div className="mx-2 h-px bg-white/10 mb-2" />

        <Link
          href="/dashboard/profile"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150",
            pathname === "/dashboard/profile"
              ? "bg-white/10 text-white"
              : "text-white/60 hover:bg-white/5 hover:text-white"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-[#5ddfb8]/20 flex items-center justify-center shrink-0">
            <span className="text-[#5ddfb8] text-xs font-bold">
              {loading ? "م" : user?.name?.charAt(0) || "م"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {loading ? "جارٍ التحميل..." : user?.name || "مدير النظام"}
            </p>
            <p className="text-white/40 text-[10px]">
              {user?.role === "admin" ? "مدير النظام" : "مستخدم"}
            </p>
          </div>
          <User className="w-4 h-4 text-white/30" />
        </Link>

        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
            router.push("/login");
          }}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors duration-150 w-full mt-1"
        >
          <LogOut className="w-4 h-4" />
          <span className="flex-1">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed right-0 top-0 h-screen w-[260px] bg-[#0c2954] z-40 flex-col shadow-2xl">
        {NavContent}
      </aside>

      {/* Mobile sidebar overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="right"
            className="w-[260px] bg-[#0c2954] p-0 border-none"
          >
            {NavContent}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
