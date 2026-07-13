// app/admin/shifts/components/CalendarView.tsx
"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Clock } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import type { Shift, User } from "@/lib/types";

const SHIFT_COLORS: Record<string, string> = {
  Morning: "bg-amber-100 text-amber-700 border-amber-200",
  Night: "bg-indigo-100 text-indigo-700 border-indigo-200",
  Day: "bg-blue-100 text-blue-700 border-blue-200",
  "Full Day": "bg-purple-100 text-purple-700 border-purple-200",
  Afternoon: "bg-orange-100 text-orange-700 border-orange-200",
  off: "bg-gray-100 text-gray-400 border-gray-200",
  "Day Off": "bg-gray-100 text-gray-400 border-gray-200",
};

interface CalendarViewProps {
  shifts: Shift[];
  deptStaff: User[];
  loading: boolean;
  month: number;
  year: number;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export function CalendarView({
  shifts,
  deptStaff,
  loading,
  month,
  year,
  selectedDate,
  onDateSelect,
}: CalendarViewProps) {
  // Get shifts for a specific date
  const getShiftsForDate = (date: Date) => {
    return shifts.filter((s) => {
      const shiftDate = new Date(s.date);
      return (
        shiftDate.getDate() === date.getDate() &&
        shiftDate.getMonth() === date.getMonth() &&
        shiftDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get ALL staff with their shifts for a date
  const getStaffWithShiftsForDate = (date: Date) => {
    const dayShifts = getShiftsForDate(date);
    if (deptStaff.length === 0) return [];
    return deptStaff.map((staff) => {
      const shift = dayShifts.find((s) => s.userId === staff.id);
      return {
        ...staff,
        shift: shift || null,
        shiftType: shift?.shiftType || null,
      };
    });
  };

  // Custom day renderer
  const renderDay = (date: Date) => {
    const staffWithShifts = getStaffWithShiftsForDate(date);
    const hasShifts = staffWithShifts.some((s) => s.shift !== null);

    return (
      <div className="relative w-full min-h-[70px] p-1">
        <span className="text-xs font-medium">{date.getDate()}</span>
        {hasShifts && (
          <div className="mt-1 space-y-0.5">
            {staffWithShifts.slice(0, 3).map((staff, idx) => {
              const shiftName = staff.shiftType?.name || "No Shift";
              const isOff =
                staff.shiftType?.isDayOff ||
                shiftName.toLowerCase() === "off" ||
                shiftName.toLowerCase() === "day off";
              return (
                <div
                  key={idx}
                  className={cn(
                    "text-[8px] font-medium px-1 py-0.5 rounded truncate",
                    isOff
                      ? "bg-gray-100 text-gray-400 border border-gray-200"
                      : SHIFT_COLORS[shiftName] || "bg-blue-100 text-blue-700",
                  )}
                >
                  {staff.firstName} {isOff ? "Off" : shiftName}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const selectedDateStaff = selectedDate
    ? getStaffWithShiftsForDate(selectedDate)
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">
            {new Date(year, month - 1).toLocaleString("default", {
              month: "long",
            })}{" "}
            {year}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              month={new Date(year, month - 1)}
              className="rounded-md border w-full"
              components={{
                Day: ({ day, ...props }) => (
                  <div {...props}>{renderDay(day.date)}</div>
                ),
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {selectedDate ? formatDate(selectedDate) : "Select a date"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : selectedDateStaff.length === 0 ? (
            <EmptyState
              title="No staff"
              description="No staff assigned to this department."
            />
          ) : (
            <div className="space-y-2">
              {selectedDateStaff.map((staff) => {
                const shiftName = staff.shiftType?.name || "No Shift";
                const isOff =
                  staff.shiftType?.isDayOff ||
                  shiftName.toLowerCase() === "off" ||
                  shiftName.toLowerCase() === "day off";
                const shiftTime = staff.shiftType
                  ? `${staff.shiftType.startTime}–${staff.shiftType.endTime}`
                  : "Not assigned";

                return (
                  <div
                    key={staff.id}
                    className="flex items-center gap-2 p-2 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                        isOff
                          ? "bg-gray-200 text-gray-500"
                          : "bg-blue-100 text-blue-700",
                      )}
                    >
                      {staff.firstName?.[0]}
                      {staff.lastName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {staff.firstName} {staff.lastName}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          isOff
                            ? "bg-gray-100 text-gray-400 border-gray-200"
                            : SHIFT_COLORS[shiftName] ||
                                "bg-blue-100 text-blue-700",
                        )}
                      >
                        {isOff ? "Off" : shiftName}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400">
                      {isOff ? "—" : shiftTime}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
