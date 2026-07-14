import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Safely formats dates and avoids crashing on undefined/null/invalid values
export function formatDate(
  date: string | Date | null | undefined,
  opts?: Intl.DateTimeFormatOptions,
) {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;

  // Check if date object is invalid
  if (isNaN(d.getTime())) return "N/A";

  return d.toLocaleDateString(
    "en-GB",
    opts ?? { day: "2-digit", month: "short", year: "numeric" },
  );
}

// Safely formats date-times and avoids crashing on undefined/null/invalid values
export function formatDateTime(date: string | Date | null | undefined) {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;

  // Check if date object is invalid
  if (isNaN(d.getTime())) return "N/A";

  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function initials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

export function titleCase(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
