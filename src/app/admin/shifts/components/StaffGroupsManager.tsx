// app/admin/shifts/components/StaffGroupsManager.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "@/lib/types";

interface StaffGroupsManagerProps {
  staff: User[];
  staffGroups: {
    morning: string[];
    night: string[];
    rotating: string[];
  };
  onGroupChange: (userId: string, group: string | null) => void;
}

export function StaffGroupsManager({
  staff,
  staffGroups,
  onGroupChange,
}: StaffGroupsManagerProps) {
  const getGroup = (uid: string) => {
    if (staffGroups.morning.includes(uid)) return "morning";
    if (staffGroups.night.includes(uid)) return "night";
    if (staffGroups.rotating.includes(uid)) return "rotating";
    return "";
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      <p className="text-sm font-medium text-gray-700 mb-1">
        Staff Groups{" "}
        <span className="text-gray-400 font-normal">
          (Pharmacy only — leave as Auto for others)
        </span>
      </p>
      <p className="text-xs text-gray-400 mb-3">
        Records, OPD, Maternity use the 15-day cycle automatically. For
        Pharmacy, assign roles below.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {staff.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-2 bg-gray-50 rounded-lg p-3"
          >
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
              {s.firstName[0]}
              {s.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                {s.firstName} {s.lastName}
              </p>
              <p className="text-xs text-gray-400">
                offset: {s.cycleOffset || 0}
              </p>
            </div>
            <Select
              value={getGroup(s.id) || undefined}
              onValueChange={(value: string | null) =>
                onGroupChange(s.id, value)
              }
            >
              <SelectTrigger className="w-[110px] text-xs">
                <SelectValue placeholder="Auto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Auto</SelectItem>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="night">Night</SelectItem>
                <SelectItem value="rotating">Rotating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
