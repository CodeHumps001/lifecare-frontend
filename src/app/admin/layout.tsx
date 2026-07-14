"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu } from "lucide-react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { RouteGuard } from "@/components/layout/route-guard";
import { Toaster } from "@/components/ui/sonner";
import { useUIStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function MobileTopbar() {
  const { toggleSidebar } = useUIStore();
  return (
    <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background px-4 lg:hidden">
      <button
        onClick={toggleSidebar}
        className="rounded p-2 hover:bg-muted"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      {/* Optimized Logo Container with no redundant brand text */}
      <div className="flex items-center gap-2">
        <Image
          src="/logo.jpeg"
          alt="Divine Netcare"
          width={120}
          height={32}
          className="h-7 w-auto object-contain"
          priority
        />
        <span className="text-xs font-semibold text-slate-400 border-l border-slate-200 pl-2">
          Admin
        </span>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close sidebar on route change for mobile
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth < 1024) {
        const { sidebarOpen } = useUIStore.getState();
        if (sidebarOpen) {
          useUIStore.getState().toggleSidebar();
        }
      }
    };
    handleRouteChange();
  }, [pathname]);

  if (isLoginPage) {
    return (
      <>
        {children}
        <Toaster richColors position="top-right" />
      </>
    );
  }

  return (
    <RouteGuard>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
        {/* Sidebar - Fixed */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
            isMounted && sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <AdminSidebar />
        </div>

        {/* Mobile overlay */}
        {isMounted && sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main content */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <MobileTopbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </RouteGuard>
  );
}
