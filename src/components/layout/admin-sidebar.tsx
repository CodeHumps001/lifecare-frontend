// components/layout/admin-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  Clock,
  FileText,
  Briefcase,
  Star,
  Bell,
  TrendingUp,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore, useAuthStore } from "@/lib/store";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Departments", href: "/admin/departments", icon: Building2 },
  { title: "Staff", href: "/admin/users", icon: Users },
  { title: "Shifts", href: "/admin/shifts", icon: Calendar },
  { title: "Attendance", href: "/admin/attendance", icon: Clock },
  { title: "Appointments", href: "/admin/appointments", icon: FileText },
  { title: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { title: "Reviews", href: "/admin/reviews", icon: Star },
  { title: "Posts", href: "/admin/posts", icon: TrendingUp },
  { title: "Announcements", href: "/admin/announcements", icon: Bell },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/admin/login";
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024 && sidebarOpen) {
      toggleSidebar();
    }
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r overflow-hidden">
      {/* Header - fixed */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
            <span className="text-sm font-bold text-white">DN</span>
          </div>
          <span className="text-sm font-semibold">Divine Netcare</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="rounded p-1 hover:bg-gray-100 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation - scrollable if needed */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Logout - fixed at bottom */}
      <div className="shrink-0 border-t px-3 pt-4 pb-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200">
            <span className="text-xs font-medium">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
