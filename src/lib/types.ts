// ─── Enums (mirrors backend Prisma schema) ─────────────────────────────

export type Role = "SUPER_ADMIN" | "DEPT_HEAD" | "STAFF";

export type Position =
  | "DOCTOR"
  | "NURSE"
  | "MIDWIFE"
  | "PHARMACIST"
  | "LAB_TECHNICIAN"
  | "RECEPTIONIST"
  | "ADMINISTRATOR"
  | "OTHER";

export type SwapStatus = "PENDING" | "APPROVED" | "REJECTED";

export type LeaveType =
  | "ANNUAL"
  | "SICK"
  | "EMERGENCY"
  | "MATERNITY"
  | "PATERNITY";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ApplicationStatus =
  | "PENDING"
  | "REVIEWED"
  | "SHORTLISTED"
  | "REJECTED";

export type JobType = "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "CONTRACT";

// ─── Core entities ──────────────────────────────────────────────────────

export interface StaffProfile {
  id: string;
  userId: string;
  phone?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
}

export interface Department {
  id: string;
  name: string;
  minStaffPerShift: number;
  cyclePattern?: string | null;
  cycleLength?: number | null;
  referenceDate?: string | null;
  createdAt: string;
  _count?: { users: number };
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  position: Position | null;
  departmentId: string | null;
  isActive: boolean;
  createdAt: string;
  // ─── Shift cycle fields ──────────────────────────────
  cycleOffset?: number; // Staff's position in the cycle
  personalCycle?: string | null; // JSON string of personal cycle
  cycleStartDate?: string | null; // When they started the cycle
  // ────────────────────────────────────────────────────
  profile?: StaffProfile | null;
  department?: { id: string; name: string } | null;
}

export interface ShiftType {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  departmentId: string;
  isDayOff: boolean;
}

export interface Shift {
  id: string;
  userId: string;
  departmentId: string;
  shiftTypeId: string;
  date: string;
  createdAt: string;
  user?: { firstName: string; lastName: string };
  shiftType?: {
    name: string;
    startTime: string;
    endTime: string;
    isDayOff?: boolean;
  };
}

export interface ShiftSwapRequest {
  id: string;
  requesterId: string;
  targetStaffId: string;
  originalShiftId: string;
  targetShiftId: string;
  status: SwapStatus;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  shiftId: string;
  clockIn?: string | null;
  clockOut?: string | null;
  clockInLatitude?: number | null;
  clockInLongitude?: number | null;
  status: AttendanceStatus;
  createdAt: string;
  user?: { firstName: string; lastName: string };
  shift?: Shift;
}

export interface LeaveApplication {
  id: string;
  userId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  reviewedBy?: string | null;
  reviewNote?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
    position: Position | null;
    department: { name: string } | null;
  };
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  departmentId?: string | null;
  authorId: string;
  createdAt: string;
  author?: { firstName: string; lastName: string };
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  patientEmail?: string | null;
  patientPhone: string;
  reason: string;
  date: string;
  status: AppointmentStatus;
  createdAt: string;
  doctor?: { firstName: string; lastName: string; position: Position | null };
}

export interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface JobListing {
  id: string;
  title: string;
  department: string;
  type: JobType;
  description: string;
  isOpen: boolean;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobListingId: string;
  name: string;
  email: string;
  phone: string;
  coverLetter?: string | null;
  cvUrl: string;
  status: ApplicationStatus;
  createdAt: string;
  jobListing?: { title: string; department: string };
}

export interface Post {
  id: string;
  title: string;
  content: string;
  coverImage?: string | null;
  authorId: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author?: { firstName: string; lastName: string };
}

export interface HospitalSettings {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  geofenceRadius: number;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  logoUrl?: string | null;
}

// ─── API envelope ───────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  status: "success";
  data: T;
  message?: string;
}

export interface ApiFailure {
  status: "failed";
  message: string;
}
