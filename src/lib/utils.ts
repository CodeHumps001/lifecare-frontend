import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-GH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(date: string | Date) {
  return new Date(date).toLocaleTimeString("en-GH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getInitials(firstName: string, lastName: string) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

export function getRoleLabel(role: string) {
  const labels: Record<string, string> = {
    SUPER_ADMIN: "Administrator",
    DEPT_HEAD: "Department Head",
    STAFF: "Staff",
  };
  return labels[role] || role;
}

export function getPositionLabel(position: string) {
  const labels: Record<string, string> = {
    DOCTOR: "Doctor",
    NURSE: "Nurse",
    MIDWIFE: "Midwife",
    PHARMACIST: "Pharmacist",
    LAB_TECHNICIAN: "Lab Technician",
    RECEPTIONIST: "Receptionist",
    ADMINISTRATOR: "Administrator",
    OTHER: "Staff",
  };
  return labels[position] || position;
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    PRESENT: "text-green-600 bg-green-50",
    LATE: "text-yellow-600 bg-yellow-50",
    ABSENT: "text-red-600 bg-red-50",
    PENDING: "text-blue-600 bg-blue-50",
    APPROVED: "text-green-600 bg-green-50",
    REJECTED: "text-red-600 bg-red-50",
    CONFIRMED: "text-green-600 bg-green-50",
    COMPLETED: "text-gray-600 bg-gray-50",
    CANCELLED: "text-red-600 bg-red-50",
  };
  return colors[status] || "text-gray-600 bg-gray-50";
}

export function truncate(text: string, length: number) {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}
