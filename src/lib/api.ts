import { getAuthToken, clearSession } from "./store";
import type {
  Announcement,
  ApiFailure,
  Appointment,
  AppointmentStatus,
  AttendanceRecord,
  AttendanceStatus,
  Department,
  HospitalSettings,
  JobApplication,
  JobListing,
  JobType,
  LeaveApplication,
  LeaveStatus,
  Position,
  Post,
  Review,
  ReviewStatus,
  Role,
  Shift,
  ShiftSwapRequest,
  ShiftType,
  SwapStatus,
  User,
} from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;

  // Build the headers dynamically
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  // Only set application/json if we are NOT sending FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // 401 anywhere in the admin panel means the session died — bounce to login
  if (res.status === 401) {
    clearSession();
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    throw new ApiError("Session expired. Please log in again.", 401);
  }

  const body = await res.json().catch(() => null);

  if (!res.ok || body?.status === "failed") {
    const message =
      (body as ApiFailure | null)?.message ?? `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return (body?.data ?? body) as T;
}

// Helper to determine whether to stringify or keep raw body (like FormData)
const serializeBody = (data?: unknown): BodyInit | undefined => {
  if (data === undefined || data === null) return undefined;
  if (data instanceof FormData) return data; // Keep FormData intact
  return JSON.stringify(data); // Safely stringify JSON payloads
};

const get = <T>(path: string) =>
  request<T>(path, { method: "GET", cache: "no-store" });

const post = <T>(path: string, data?: unknown) =>
  request<T>(path, {
    method: "POST",
    body: serializeBody(data),
  });

const put = <T>(path: string, data?: unknown) =>
  request<T>(path, {
    method: "PUT",
    body: serializeBody(data),
  });

const patch = <T>(path: string, data?: unknown) =>
  request<T>(path, {
    method: "PATCH",
    body: serializeBody(data),
  });

const del = <T>(path: string) => request<T>(path, { method: "DELETE" });

// ─── Auth ────────────────────────────────────────────────────────────

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    position: Position | null;
    departmentId: string | null;
  };
}

export interface CreateStaffPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  position: Position;
  departmentId?: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    post<LoginResponse>("/auth/login", { email, password }),
  createStaff: (payload: CreateStaffPayload) =>
    post<{ id: string }>("/auth/register", payload),
};

// ─── Users / Staff ───────────────────────────────────────────────────

export const usersApi = {
  list: () => get<User[]>("/users"),
  get: (id: string) => get<User>(`/users/${id}`),
  deactivate: (id: string) => patch<User>(`/users/${id}/deactivate`, {}),
  remove: (id: string) => del<void>(`/users/${id}`),
};

// ─── Departments ─────────────────────────────────────────────────────

export const departmentsApi = {
  list: () => get<Department[]>("/departments"),
  get: (id: string) =>
    get<Department & { shiftTypes: ShiftType[]; users: User[] }>(
      `/departments/${id}`,
    ),
  create: (name: string, minStaffPerShift: number) =>
    post<Department>("/departments", { name, minStaffPerShift }),
  update: (id: string, name: string, minStaffPerShift: number) =>
    put<Department>(`/departments/${id}`, { name, minStaffPerShift }),
  remove: (id: string) => del<void>(`/departments/${id}`),
};

// ─── Shift Types ─────────────────────────────────────────────────────

export interface CreateShiftTypePayload {
  name: string;
  startTime: string;
  endTime: string;
  departmentId: string;
  isDayOff?: boolean;
}

export const shiftTypesApi = {
  listByDepartment: (departmentId: string) =>
    get<ShiftType[]>(`/shift-types/${departmentId}`),
  create: (payload: CreateShiftTypePayload) =>
    post<ShiftType>("/shift-types", payload),
  update: (id: string, payload: Partial<CreateShiftTypePayload>) =>
    put<ShiftType>(`/shift-types/${id}`, payload),
  remove: (id: string) => del<void>(`/shift-types/${id}`),
};

// ─── Shifts ──────────────────────────────────────────────────────────

export interface GenerateShiftPayload {
  departmentId: string;
  month: number;
  year: number;
  mode: "auto" | "manual";
  assignments?: { userId: string; shiftTypeId: string; days: number[] }[];
  staffGroups?: { morning?: string[]; night?: string[]; rotating?: string[] };
}

export const shiftsApi = {
  generate: (payload: GenerateShiftPayload) =>
    post<{ message: string; totalShifts: number }>("/shifts/generate", payload),
  byDepartment: (departmentId: string) =>
    get<Shift[]>(`/shifts/department/${departmentId}`),
  swapRequests: {
    byDepartment: (departmentId: string) =>
      get<
        {
          id: string;
          status: SwapStatus;
          createdAt: string;
          requester: { firstName: string; lastName: string };
          targetStaff: { firstName: string; lastName: string };
          originalShift: { date: string; shiftType: { name: string } };
          targetShift: { date: string; shiftType: { name: string } };
        }[]
      >(`/shifts/swap-requests/${departmentId}`),
    updateStatus: (id: string, status: SwapStatus) =>
      patch<ShiftSwapRequest>(`/shifts/swap-request/${id}`, { status }),
  },
};

// ─── Leave ───────────────────────────────────────────────────────────

export const leaveApi = {
  byDepartment: () => get<LeaveApplication[]>("/leave/department"),
  review: (id: string, status: LeaveStatus, reviewNote?: string) =>
    patch<{ message: string }>(`/leave/${id}/review`, { status, reviewNote }),
};

// ─── Attendance ──────────────────────────────────────────────────────

export const attendanceApi = {
  byDepartment: (departmentId: string, dateString?: string) => {
    const query = dateString ? `?date=${dateString}` : "";
    return get<AttendanceRecord[]>(
      `/attendance/department/${departmentId}${query}`,
    );
  },
  manualOverride: (id: string, status: AttendanceStatus) =>
    patch<AttendanceRecord>(`/attendance/${id}/manual`, { status }),
};

// ─── Announcements ───────────────────────────────────────────────────

export interface AnnouncementPayload {
  title: string;
  content: string;
  departmentId?: string;
}

export const announcementsApi = {
  list: () => get<Announcement[]>("/announcements"),
  create: (payload: AnnouncementPayload) =>
    post<Announcement>("/announcements", payload),
  update: (
    id: string,
    payload: Pick<AnnouncementPayload, "title" | "content">,
  ) => put<Announcement>(`/announcements/${id}`, payload),
  remove: (id: string) => del<void>(`/announcements/${id}`),
};

// ─── Appointments ────────────────────────────────────────────────────

export const appointmentsApi = {
  list: () => get<Appointment[]>("/appointments"),
  updateStatus: (id: string, status: AppointmentStatus) =>
    patch<Appointment>(`/appointments/${id}/status`, { status }),
};

// ─── Reviews ─────────────────────────────────────────────────────────

export const reviewsApi = {
  listApproved: () => get<Review[]>("/reviews"),
  listAll: () => get<Review[]>("/reviews/all"),
  updateStatus: (id: string, status: ReviewStatus) =>
    patch<Review>(`/reviews/${id}`, { status }),
};

// ─── Jobs ────────────────────────────────────────────────────────────

export interface JobListingPayload {
  title: string;
  department: string;
  type: JobType;
  description: string;
  isOpen?: boolean;
}

export const jobsApi = {
  list: () => get<JobListing[]>("/jobs"),
  create: (payload: JobListingPayload) => post<JobListing>("/jobs", payload),
  update: (id: string, payload: Partial<JobListingPayload>) =>
    patch<JobListing>(`/jobs/${id}`, payload),
  remove: (id: string) => del<void>(`/jobs/${id}`),
  applications: {
    list: () => get<JobApplication[]>("/jobs/applications"),
    updateStatus: (id: string, status: JobApplication["status"]) =>
      patch<JobApplication>(`/jobs/applications/${id}`, { status }),
  },
};

// ─── Posts (Blog) ────────────────────────────────────────────────────

export interface PostPayload {
  title: string;
  content: string;
  coverImage?: string;
}

export const postsApi = {
  list: () => get<Post[]>("/posts"),
  listAdmin: () => get<Post[]>("/posts/admin"), // Add this route
  get: (id: string) => get<Post>(`/posts/${id}`),
  create: (payload: FormData) => post<Post>("/posts", payload),
  update: (id: string, payload: FormData) => put<Post>(`/posts/${id}`, payload),
  remove: (id: string) => del<void>(`/posts/${id}`),
  togglePublish: (id: string) => patch<Post>(`/posts/${id}/publish`, {}),
};
// ─── Hospital Settings ───────────────────────────────────────────────

export interface HospitalSettingsPayload {
  name: string;
  latitude: number;
  longitude: number;
  geofenceRadius: number;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
}

export const settingsApi = {
  get: () => get<HospitalSettings>("/settings"),
  update: (payload: HospitalSettingsPayload) =>
    put<HospitalSettings>("/settings", payload),
};

export { ApiError };
