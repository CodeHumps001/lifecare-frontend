import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, Position } from "./types";

export interface SessionUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  position: Position | null;
  departmentId: string | null;
}

interface AuthState {
  token: string | null;
  user: SessionUser | null;
  isAuthenticated: boolean;
  setSession: (token: string, user: SessionUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setSession: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: "lifecare-admin-auth",
    },
  ),
);

// Non-hook accessor — used by lib/api.ts outside React components
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return useAuthStore.getState().token;
}

export function clearSession() {
  useAuthStore.getState().logout();
}

// ─── UI store: sidebar collapse state on mobile ────────────────────────

interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
}));
