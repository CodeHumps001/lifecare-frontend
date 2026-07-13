// app/admin/shifts/components/ScheduleTab.tsx
"use client";

import { useState } from "react";
import { Wand2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CalendarView } from "./CalendarView";
import { StaffGroupsManager } from "./StaffGroupsManager";
import { useShifts } from "../hooks/useShifts";
import { MONTHS } from "../hooks/contants";
// import { MONTHS } from "../constants";

interface ScheduleTabProps {
  departmentId: string;
}

export function ScheduleTab({ departmentId }: ScheduleTabProps) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [generating, setGenerating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [staffGroups, setStaffGroups] = useState<{
    morning: string[];
    night: string[];
    rotating: string[];
  }>({ morning: [], night: [], rotating: [] });

  const { shifts, deptStaff, loading, loadData, generateShifts } =
    useShifts(departmentId);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // 🔥 FIX: Send staffGroups when generating
      // Only send staffGroups if any groups are assigned
      const hasGroups =
        staffGroups.morning.length > 0 ||
        staffGroups.night.length > 0 ||
        staffGroups.rotating.length > 0;

      const result = await generateShifts(
        month,
        year,
        hasGroups ? staffGroups : undefined,
      );
      toast.success(result.message);
    } catch (err) {
      // Error already handled in useShifts
    } finally {
      setGenerating(false);
    }
  };

  const handleGroupChange = (userId: string, group: string | null) => {
    if (!group) {
      setStaffGroups((prev) => ({
        morning: prev.morning.filter((id) => id !== userId),
        night: prev.night.filter((id) => id !== userId),
        rotating: prev.rotating.filter((id) => id !== userId),
      }));
      return;
    }
    setStaffGroups((prev) => {
      const cleaned = {
        morning: prev.morning.filter((id) => id !== userId),
        night: prev.night.filter((id) => id !== userId),
        rotating: prev.rotating.filter((id) => id !== userId),
      };
      if (group === "morning") cleaned.morning.push(userId);
      else if (group === "night") cleaned.night.push(userId);
      else if (group === "rotating") cleaned.rotating.push(userId);
      return cleaned;
    });
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-6">
          <div className="space-y-2">
            <Label>Month</Label>
            <Select
              value={String(month)}
              onValueChange={(value) =>
                value !== null && setMonth(Number(value))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={m} value={String(i + 1)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Input
              type="number"
              className="w-28"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>
          <ConfirmDialog
            trigger={
              <Button disabled={generating} className="gap-2">
                <Wand2 className="h-4 w-4" />
                {generating ? "Generating…" : "Generate Schedule"}
              </Button>
            }
            title="Generate this month's schedule?"
            description="This will generate the schedule for the selected department and month using the configured shift cycle."
            confirmLabel="Generate"
            destructive={false}
            onConfirm={handleGenerate}
          />
          <Button variant="outline" onClick={loadData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>

      {/* Staff Groups - Show for all departments, but only Pharmacy uses them */}
      {deptStaff.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <StaffGroupsManager
              staff={deptStaff}
              staffGroups={staffGroups}
              onGroupChange={handleGroupChange}
            />
          </CardContent>
        </Card>
      )}

      {/* Calendar View */}
      <CalendarView
        shifts={shifts}
        deptStaff={deptStaff}
        loading={loading}
        month={month}
        year={year}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
    </div>
  );
}
