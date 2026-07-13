// app/admin/shifts/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departmentsApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import type { Department } from "@/lib/types";
import { ScheduleTab } from "./components/ScheduleTab";
import { ShiftTypesTab } from "./components/ShiftTypesTab";
import { SwapRequestsTab } from "./components/SwapRequestsTab";

export default function ShiftsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState<string>("");
  const [loadingDeps, setLoadingDeps] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "schedule" | "shift-types" | "swaps"
  >("schedule");

  useEffect(() => {
    departmentsApi
      .list()
      .then((deps) => {
        setDepartments(deps);
        if (deps.length > 0) setDepartmentId(deps[0].id);
      })
      .catch((err) =>
        toast.error(
          err instanceof ApiError ? err.message : "Failed to load departments",
        ),
      )
      .finally(() => setLoadingDeps(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shift Management"
        description="Generate schedules, manage shift types, and review swap requests."
      />

      <div className="max-w-xs">
        <Label className="mb-2 block">Department</Label>
        {loadingDeps ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            value={departmentId}
            onValueChange={(value) => value !== null && setDepartmentId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {!departmentId ? (
        <EmptyState
          icon={CalendarClock}
          title="Select a department"
          description="Choose a department above to manage its shift types and schedule."
        />
      ) : (
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("schedule")}
              className={`px-4 py-2 text-sm font-medium transition-all hover:text-gray-700 hover:border-gray-300 ${
                activeTab === "schedule"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 border-b-2 border-transparent"
              }`}
            >
              Schedule
            </button>
            <button
              onClick={() => setActiveTab("shift-types")}
              className={`px-4 py-2 text-sm font-medium transition-all hover:text-gray-700 hover:border-gray-300 ${
                activeTab === "shift-types"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 border-b-2 border-transparent"
              }`}
            >
              Shift Types
            </button>
            <button
              onClick={() => setActiveTab("swaps")}
              className={`px-4 py-2 text-sm font-medium transition-all hover:text-gray-700 hover:border-gray-300 ${
                activeTab === "swaps"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 border-b-2 border-transparent"
              }`}
            >
              Swap Requests
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "schedule" && (
            <ScheduleTab departmentId={departmentId} />
          )}
          {activeTab === "shift-types" && (
            <ShiftTypesTab departmentId={departmentId} />
          )}
          {activeTab === "swaps" && (
            <SwapRequestsTab departmentId={departmentId} />
          )}
        </div>
      )}
    </div>
  );
}
