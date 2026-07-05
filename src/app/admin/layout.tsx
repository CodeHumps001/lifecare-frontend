"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  BookOpen,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { getInitials } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/departments", icon: Building2, label: "Departments" },
  { href: "/admin/users", icon: Users, label: "Staff" },
  { href: "/admin/shifts", icon: Calendar, label: "Shifts" },
  { href: "/admin/attendance", icon: Clock, label: "Attendance" },
  { href: "/admin/leave", icon: FileText, label: "Leave" },
  { href: "/admin/appointments", icon: Calendar, label: "Appointments" },
  { href: "/admin/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/admin/reviews", icon: Star, label: "Reviews" },
  { href: "/admin/posts", icon: BookOpen, label: "Blog Posts" },
  { href: "/admin/announcements", icon: Bell, label: "Announcements" },
];

const formatRole = (role: string) => {
  if (!role) return "";
  return role
    .split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, logout, hydrate } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    hydrate();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [hydrated, isAuthenticated, pathname]);

  if (!hydrated) return null;
  if (pathname === "/admin/login") return <>{children}</>;
  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 flex font-sans antialiased">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark text-white flex flex-col h-full transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:h-full flex-shrink-0 overflow-hidden border-r border-white/5`}
      >
        {/* Premium Styled Logo Header Container */}
        <div className="p-5 border-b border-white/10 flex-shrink-0">
          <div className="w-full h-14 relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-center backdrop-blur-sm">
            <div className="w-full h-full relative">
              <Image
                src="/logo.jpeg"
                alt="Divine Netcare Logo"
                fill
                sizes="224px"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Dynamic Nav Link Area - Only this container scrolls inside the sidebar */}
        <nav className="flex-1 py-3 overflow-y-auto space-y-0.5 px-2 select-none scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-brand-secondary text-white shadow-lg shadow-brand-secondary/20 font-semibold"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <item.icon
                  className={`w-4 h-4 flex-shrink-0 transition-transform ${active ? "scale-105" : ""}`}
                />
                <span className="truncate">{item.label}</span>
                {active && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-80" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Upgraded Profile Card Footer */}
        <div className="p-4 border-t border-white/10 mt-auto flex-shrink-0 bg-black/10">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/5 mb-2.5">
            <div className="w-9 h-9 bg-brand-secondary rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-md ring-2 ring-white/10">
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate tracking-wide">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-gray-400 text-xs truncate font-medium mt-0.5">
                {formatRole(user.role)}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 text-sm w-full transition-all duration-200 py-2.5 rounded-xl font-medium"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Framework Layout Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header Section */}
        <header className="bg-white border-b border-gray-200/80 px-6 py-3.5 flex items-center gap-4 flex-shrink-0 shadow-sm shadow-gray-100/40">
          <button
            className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-brand-dark text-base tracking-tight">
              {navItems.find((n) => n.href === pathname)?.label || "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-500 hover:text-brand-primary transition-colors hidden sm:block border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 shadow-sm"
            >
              View Website
            </Link>
            <div className="w-8 h-8 bg-brand-primary/10 border border-brand-primary/20 rounded-xl flex items-center justify-center text-brand-primary text-xs font-bold shadow-inner">
              {getInitials(user.firstName, user.lastName)}
            </div>
          </div>
        </header>

        {/* Application Page View Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto min-h-0 bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
