"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Pencil,
  CalendarClock,
  Wand2,
  RefreshCw,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { departmentsApi, shiftTypesApi, shiftsApi, usersApi } from "@/lib/api";
import type { CreateShiftTypePayload } from "@/lib/api";
import { ApiError } from "@/lib/api";
import type { Department, Shift, ShiftType, User } from "@/lib/types";
import { formatDate, cn } from "@/lib/utils";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SHIFT_COLORS: Record<string, string> = {
  Morning: "bg-amber-100 text-amber-700 border-amber-200",
  Night: "bg-indigo-100 text-indigo-700 border-indigo-200",
  Day: "bg-blue-100 text-blue-700 border-blue-200",
  "Full Day": "bg-purple-100 text-purple-700 border-purple-200",
  Afternoon: "bg-orange-100 text-orange-700 border-orange-200",
  off: "bg-gray-100 text-gray-400 border-gray-200",
  "Day Off": "bg-gray-100 text-gray-400 border-gray-200",
};

const emptyShiftType: CreateShiftTypePayload = {
  name: "",
  startTime: "08:00",
  endTime: "16:00",
  departmentId: "",
  isDayOff: false,
};

export default function ShiftsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState<string>("");
  const [loadingDeps, setLoadingDeps] = useState(true);

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
          {/* Custom horizontal tabs */}
          <div className="flex flex-wrap gap-1 border-b border-gray-200">
            <button
              onClick={() => {
                const tabs = document.querySelectorAll("[data-tab]");
                tabs.forEach((tab) => tab.classList.remove("active"));
                document
                  .querySelector('[data-tab="schedule"]')
                  ?.classList.add("active");
                document
                  .querySelectorAll("[data-tab-content]")
                  .forEach((content) => {
                    content.classList.add("hidden");
                  });
                document
                  .querySelector('[data-tab-content="schedule"]')
                  ?.classList.remove("hidden");
              }}
              data-tab="schedule"
              className="active px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600 transition-all hover:text-blue-800"
            >
              Schedule
            </button>
            <button
              onClick={() => {
                const tabs = document.querySelectorAll("[data-tab]");
                tabs.forEach((tab) => tab.classList.remove("active"));
                document
                  .querySelector('[data-tab="shift-types"]')
                  ?.classList.add("active");
                document
                  .querySelectorAll("[data-tab-content]")
                  .forEach((content) => {
                    content.classList.add("hidden");
                  });
                document
                  .querySelector('[data-tab-content="shift-types"]')
                  ?.classList.remove("hidden");
              }}
              data-tab="shift-types"
              className="px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent transition-all hover:text-gray-700 hover:border-gray-300"
            >
              Shift Types
            </button>
            <button
              onClick={() => {
                const tabs = document.querySelectorAll("[data-tab]");
                tabs.forEach((tab) => tab.classList.remove("active"));
                document
                  .querySelector('[data-tab="swaps"]')
                  ?.classList.add("active");
                document
                  .querySelectorAll("[data-tab-content]")
                  .forEach((content) => {
                    content.classList.add("hidden");
                  });
                document
                  .querySelector('[data-tab-content="swaps"]')
                  ?.classList.remove("hidden");
              }}
              data-tab="swaps"
              className="px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent transition-all hover:text-gray-700 hover:border-gray-300"
            >
              Swap Requests
            </button>
          </div>

          {/* Tab Content */}
          <div data-tab-content="schedule" className="block">
            <ScheduleTab departmentId={departmentId} />
          </div>
          <div data-tab-content="shift-types" className="hidden">
            <ShiftTypesTab departmentId={departmentId} />
          </div>
          <div data-tab-content="swaps" className="hidden">
            <SwapRequestsTab departmentId={departmentId} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Schedule Tab with Calendar ─────────────────────────────────────

function ScheduleTab({ departmentId }: { departmentId: string }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [generating, setGenerating] = useState(false);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [deptStaff, setDeptStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [shiftsData, staffData] = await Promise.all([
        shiftsApi.byDepartment(departmentId),
        usersApi.list(),
      ]);
      setShifts(shiftsData);
      // Filter staff in this department
      const staff = staffData.filter(
        (s: User) => s.departmentId === departmentId && s.isActive,
      );
      setDeptStaff(staff);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to load data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [departmentId]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await shiftsApi.generate({
        departmentId,
        month,
        year,
        mode: "auto",
      });
      toast.success(result.message);
      loadData();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to generate schedule",
      );
    } finally {
      setGenerating(false);
    }
  };

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

    // Map all staff to their shifts (or null if no shift)
    return deptStaff.map((staff) => {
      const shift = dayShifts.find((s) => s.userId === staff.id);
      return {
        ...staff,
        shift: shift || null,
        shiftType: shift?.shiftType || null,
      };
    });
  };

  // Custom day renderer for calendar - shows ALL staff
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

  // Get selected date staff with shifts
  const selectedDateStaff = selectedDate
    ? getStaffWithShiftsForDate(selectedDate)
    : [];

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

      {/* Calendar View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              {MONTHS[month - 1]} {year}
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
                onSelect={setSelectedDate}
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

        {/* Selected Date Details - Shows ALL staff */}
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

      {/* List View Toggle - Shows ALL shifts including Off */}
      <details className="block lg:hidden">
        <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">
          View as List
        </summary>
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {MONTHS[month - 1]} {year} Schedule
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  (
                  {
                    shifts.filter(
                      (s) =>
                        new Date(s.date).getMonth() + 1 === month &&
                        new Date(s.date).getFullYear() === year,
                    ).length
                  }{" "}
                  shifts)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Staff</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shifts
                      .filter((s) => {
                        const d = new Date(s.date);
                        return (
                          d.getMonth() + 1 === month && d.getFullYear() === year
                        );
                      })
                      .sort(
                        (a, b) =>
                          new Date(a.date).getTime() -
                          new Date(b.date).getTime(),
                      )
                      .map((s) => {
                        const isOff = s.shiftType?.isDayOff;
                        return (
                          <TableRow key={s.id}>
                            <TableCell className="font-medium">
                              {formatDate(s.date)}
                            </TableCell>
                            <TableCell>
                              {s.user?.firstName} {s.user?.lastName}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={isOff ? "secondary" : "default"}
                                className={
                                  isOff ? "bg-gray-100 text-gray-400" : ""
                                }
                              >
                                {s.shiftType?.name || "Unknown"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {isOff
                                ? "—"
                                : `${s.shiftType?.startTime} – ${s.shiftType?.endTime}`}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </details>
    </div>
  );
}

// ─── Shift Types Tab ─────────────────────────────────────────────────

function ShiftTypesTab({ departmentId }: { departmentId: string }) {
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ShiftType | null>(null);
  const [form, setForm] = useState<CreateShiftTypePayload>({
    ...emptyShiftType,
    departmentId,
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await shiftTypesApi.listByDepartment(departmentId);
      setShiftTypes(data);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to load shift types",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [departmentId]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyShiftType, departmentId });
    setDialogOpen(true);
  };

  const openEdit = (st: ShiftType) => {
    setEditing(st);
    setForm({
      name: st.name,
      startTime: st.startTime,
      endTime: st.endTime,
      departmentId,
      isDayOff: st.isDayOff,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || (!form.isDayOff && (!form.startTime || !form.endTime))) {
      toast.error("Name and time are required");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await shiftTypesApi.update(editing.id, form);
        toast.success("Shift type updated");
      } else {
        await shiftTypesApi.create(form);
        toast.success("Shift type created");
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to save shift type",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await shiftTypesApi.remove(id);
      toast.success("Shift type deleted");
      load();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to delete shift type",
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              New Shift Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Shift Type" : "New Shift Type"}
              </DialogTitle>
              <DialogDescription>
                Shift types feed the auto-scheduler — name morning/night/off
                shifts consistently.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Night, Morning, Full Day, Off"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start time</Label>
                  <Input
                    type="time"
                    value={form.startTime}
                    onChange={(e) =>
                      setForm({ ...form, startTime: e.target.value })
                    }
                    disabled={form.isDayOff}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End time</Label>
                  <Input
                    type="time"
                    value={form.endTime}
                    onChange={(e) =>
                      setForm({ ...form, endTime: e.target.value })
                    }
                    disabled={form.isDayOff}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isDayOff"
                  checked={form.isDayOff}
                  onCheckedChange={(v) =>
                    setForm({ ...form, isDayOff: Boolean(v) })
                  }
                />
                <Label
                  htmlFor="isDayOff"
                  className="cursor-pointer font-normal"
                >
                  This is a day-off slot (not a working shift)
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Shift Types
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({shiftTypes.length} types)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : shiftTypes.length === 0 ? (
            <EmptyState
              title="No shift types yet"
              description="Add shift types like Morning, Night, and Off before generating a schedule."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shiftTypes.map((st) => (
                  <TableRow key={st.id}>
                    <TableCell className="font-medium">{st.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {st.isDayOff ? "—" : `${st.startTime} – ${st.endTime}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant={st.isDayOff ? "secondary" : "default"}>
                        {st.isDayOff ? "Day Off" : "Working"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(st)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        }
                        title={`Delete ${st.name}?`}
                        description="This cannot be undone."
                        confirmLabel="Delete"
                        onConfirm={() => handleDelete(st.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Swap Requests Tab ─────────────────────────────────────────────────

interface SwapRequestRow {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  requester: { firstName: string; lastName: string };
  targetStaff: { firstName: string; lastName: string };
  originalShift: { date: string; shiftType: { name: string } };
  targetShift: { date: string; shiftType: { name: string } };
}

function SwapRequestsTab({ departmentId }: { departmentId: string }) {
  const [requests, setRequests] = useState<SwapRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await shiftsApi.swapRequests.byDepartment(departmentId);
      setRequests(data);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to load swap requests",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [departmentId]);

  const handleDecision = async (
    id: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    setUpdatingId(id);
    try {
      await shiftsApi.swapRequests.updateStatus(id, status);
      toast.success(`Swap request ${status.toLowerCase()}`);
      load();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to update swap request",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const pending = requests.filter((r) => r.status === "PENDING");

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Pending Swap Requests
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({pending.length} pending)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : pending.length === 0 ? (
          <EmptyState
            title="No pending swap requests"
            description="Staff shift-swap requests for this department will appear here."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Wants to swap with</TableHead>
                <TableHead>Their shift</TableHead>
                <TableHead>For</TableHead>
                <TableHead className="text-right">Decision</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">
                    {r.requester.firstName} {r.requester.lastName}
                  </TableCell>
                  <TableCell>
                    {r.targetStaff.firstName} {r.targetStaff.lastName}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(r.originalShift.date)} ·{" "}
                    {r.originalShift.shiftType.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(r.targetShift.date)} ·{" "}
                    {r.targetShift.shiftType.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="mr-2"
                      disabled={updatingId === r.id}
                      onClick={() => handleDecision(r.id, "APPROVED")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={updatingId === r.id}
                      onClick={() => handleDecision(r.id, "REJECTED")}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
