import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// attach token to every request if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("lifecare_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("lifecare_token");
      localStorage.removeItem("lifecare_user");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────
export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (data: any) => api.post("/auth/register", data),
};

// ─── Departments ─────────────────────────────────────────
export const departmentsAPI = {
  getAll: () => api.get("/departments"),
  getOne: (id: string) => api.get(`/departments/${id}`),
  create: (data: any) => api.post("/departments", data),
  update: (id: string, data: any) => api.put(`/departments/${id}`, data),
  delete: (id: string) => api.delete(`/departments/${id}`),
};

// ─── Users ───────────────────────────────────────────────
export const usersAPI = {
  getAll: () => api.get("/users"),
  getOne: (id: string) => api.get(`/users/${id}`),
  updateProfile: (data: any) => api.put("/users/profile", data),
  deactivate: (id: string) => api.patch(`/users/${id}/deactivate`),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// ─── Shifts ──────────────────────────────────────────────
export const shiftsAPI = {
  generate: (data: any) => api.post("/shifts/generate", data),
  getMyShifts: () => api.get("/shifts/my-shifts"),
  getDepartmentShifts: (departmentId: string) =>
    api.get(`/shifts/department/${departmentId}`),
  swapRequest: (data: any) => api.post("/shifts/swap-request", data),
  reviewSwap: (id: string, status: string) =>
    api.patch(`/shifts/swap-request/${id}`, { status }),
};

// ─── Shift Types ─────────────────────────────────────────
export const shiftTypesAPI = {
  getByDepartment: (departmentId: string) =>
    api.get(`/shift-types/${departmentId}`),
  create: (data: any) => api.post("/shift-types", data),
  update: (id: string, data: any) => api.put(`/shift-types/${id}`, data),
  delete: (id: string) => api.delete(`/shift-types/${id}`),
};

// ─── Attendance ──────────────────────────────────────────
export const attendanceAPI = {
  clockIn: (latitude: number, longitude: number) =>
    api.post("/attendance/clock-in", { latitude, longitude }),
  clockOut: () => api.post("/attendance/clock-out"),
  getMyAttendance: () => api.get("/attendance/my-attendance"),
  getDepartmentAttendance: (departmentId: string) =>
    api.get(`/attendance/department/${departmentId}`),
  manualOverride: (id: string, status: string) =>
    api.patch(`/attendance/${id}/manual`, { status }),
};

// ─── Leave ───────────────────────────────────────────────
export const leaveAPI = {
  apply: (data: any) => api.post("/leave", data),
  getMyLeave: () => api.get("/leave/my-leave"),
  getDepartmentLeave: () => api.get("/leave/department"),
  review: (id: string, data: any) => api.patch(`/leave/${id}/review`, data),
};

// ─── Appointments ────────────────────────────────────────
export const appointmentsAPI = {
  book: (data: any) => api.post("/appointments", data),
  getAll: () => api.get("/appointments"),
  getDoctorAppointments: () => api.get("/appointments/doctor"),
  updateStatus: (id: string, status: string) =>
    api.patch(`/appointments/${id}/status`, { status }),
};

// ─── Reviews ─────────────────────────────────────────────
export const reviewsAPI = {
  submit: (data: any) => api.post("/reviews", data),
  getApproved: () => api.get("/reviews"),
  updateStatus: (id: string, status: string) =>
    api.patch(`/reviews/${id}`, { status }),
};

// ─── Jobs ────────────────────────────────────────────────
export const jobsAPI = {
  getAll: () => api.get("/jobs"),
  create: (data: any) => api.post("/jobs", data),
  update: (id: string, data: any) => api.patch(`/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/jobs/${id}`),
  apply: (id: string, data: any) => api.post(`/jobs/${id}/apply`, data),
  getApplications: () => api.get("/jobs/applications"),
  updateApplication: (id: string, status: string) =>
    api.patch(`/jobs/applications/${id}`, { status }),
};

// ─── Posts ───────────────────────────────────────────────
export const postsAPI = {
  getPublished: () => api.get("/posts"),
  getOne: (id: string) => api.get(`/posts/${id}`),
  create: (data: any) => api.post("/posts", data),
  update: (id: string, data: any) => api.put(`/posts/${id}`, data),
  delete: (id: string) => api.delete(`/posts/${id}`),
  publish: (id: string) => api.patch(`/posts/${id}/publish`),
};

// ─── Announcements ───────────────────────────────────────
export const announcementsAPI = {
  getAll: () => api.get("/announcements"),
  getOne: (id: string) => api.get(`/announcements/${id}`),
  create: (data: any) => api.post("/announcements", data),
  update: (id: string, data: any) => api.put(`/announcements/${id}`, data),
  delete: (id: string) => api.delete(`/announcements/${id}`),
};

// ─── Doctors (from users with position=DOCTOR) ───────────
export const getDoctors = async () => {
  const res = await api.get("/users");
  return res.data.data.filter((u: any) => u.position === "DOCTOR");
};
