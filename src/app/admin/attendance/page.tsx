"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Clock4,
  Calendar as CalendarIcon,
  Download,
  X,
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
} from "lucide-react";
import { format, isValid, isWithinInterval, subDays } from "date-fns";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { departmentsApi, attendanceApi, ApiError } from "@/lib/api";
import type {
  AttendanceRecord,
  AttendanceStatus,
  Department,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: AttendanceStatus[] = ["PRESENT", "LATE", "ABSENT"];

export default function AttendancePage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<Date | undefined>(
    subDays(new Date(), 7),
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const formatTimeSafe = (
    dateStr: string | Date | undefined | null,
  ): string => {
    if (!dateStr) return "—";
    const parsed = new Date(dateStr);
    return isValid(parsed) ? format(parsed, "hh:mm a") : "—";
  };

  const formatDateSafe = (
    dateStr: string | Date | undefined | null,
  ): string => {
    if (!dateStr) return "—";
    const parsed = new Date(dateStr);
    return isValid(parsed) ? format(parsed, "MMM dd, yyyy") : "—";
  };

  const displayedRecords = (() => {
    if (!startDate || !endDate) return records;

    const startBoundary = new Date(startDate);
    startBoundary.setHours(0, 0, 0, 0);

    const endBoundary = new Date(endDate);
    endBoundary.setHours(23, 59, 59, 999);

    const actualStart =
      startBoundary <= endBoundary ? startBoundary : endBoundary;
    const actualEnd =
      startBoundary <= endBoundary ? endBoundary : startBoundary;

    return records.filter((r) => {
      const dateStr = r.clockIn || r.createdAt;
      if (!dateStr) return false;

      const recordDate = new Date(dateStr);
      if (!isValid(recordDate)) return false;

      return isWithinInterval(recordDate, {
        start: actualStart,
        end: actualEnd,
      });
    });
  })();

  const metrics = (() => {
    const total = displayedRecords.length;
    if (total === 0)
      return { total: 0, present: 0, late: 0, absent: 0, rate: 0 };

    const present = displayedRecords.filter(
      (r) => r.status === "PRESENT",
    ).length;
    const late = displayedRecords.filter((r) => r.status === "LATE").length;
    const absent = displayedRecords.filter((r) => r.status === "ABSENT").length;
    const rate = Math.round(((present + late) / total) * 100);

    return { total, present, late, absent, rate };
  })();

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
      );
  }, []);

  useEffect(() => {
    if (!departmentId) return;

    setLoading(true);
    attendanceApi
      .byDepartment(departmentId)
      .then((data) => {
        setRecords(data || []);
      })
      .catch((err) =>
        toast.error(
          err instanceof ApiError ? err.message : "Failed to load attendance",
        ),
      )
      .finally(() => setLoading(false));
  }, [departmentId]);

  const handleOverride = async (id: string, status: AttendanceStatus) => {
    setUpdatingId(id);
    try {
      const updated = await attendanceApi.manualOverride(id, status);
      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: updated.status } : r)),
      );
      toast.success(`Status overridden to ${status}`);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to update status",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCSV = () => {
    const targetDept = departments.find((d) => d.id === departmentId);
    const deptName = targetDept ? targetDept.name : "Department";

    if (displayedRecords.length === 0) {
      toast.error("No records within selected date range to export.");
      return;
    }

    const headers = [
      "Staff Name",
      "Department",
      "Shift Type",
      "Clock In Date",
      "Clock In Time",
      "Clock Out Time",
      "Status",
    ];

    const rows = displayedRecords.map((r) => [
      `${r.user?.firstName ?? ""} ${r.user?.lastName ?? ""}`.trim(),
      deptName,
      r.shift?.shiftType?.name ?? "—",
      r.clockIn ? format(new Date(r.clockIn), "yyyy-MM-dd") : "—",
      r.clockIn ? formatTimeSafe(r.clockIn) : "—",
      r.clockOut ? formatTimeSafe(r.clockOut) : "—",
      r.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const startStr = startDate ? format(startDate, "yyyy-MM-dd") : "anytime";
    const endStr = endDate ? format(endDate, "yyyy-MM-dd") : "anytime";

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `attendance_${deptName.toLowerCase().replace(/\s+/g, "_")}_${startStr}_to_${endStr}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Successfully exported ${displayedRecords.length} records!`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 selection:bg-slate-900/10 dark:selection:bg-white/10 antialiased text-slate-900 dark:text-slate-50">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/40 dark:border-slate-800/40 pb-6">
        <PageHeader
          title="Attendance Portal"
          description="Track and override geofenced clock-in metrics with detailed reporting."
        />
        <div className="flex items-center gap-2 bg-slate-900/[0.03] dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-full text-xs font-medium self-start md:self-auto border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
          <span className="tracking-tight font-mono">
            Live Monitoring Active
          </span>
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Metric Card */}
        <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/50 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Total Active Logs
              </span>
              <h3 className="text-3xl font-bold tracking-tight font-mono">
                {loading ? (
                  <Skeleton className="h-9 w-12 bg-slate-100 dark:bg-slate-800" />
                ) : (
                  metrics.total
                )}
              </h3>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl shadow-sm">
              <Users className="h-5 w-5 stroke-[1.75]" />
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-slate-300 dark:bg-slate-700 opacity-50" />
        </Card>

        {/* Attendance Rate Card */}
        <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/50 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-emerald-200 dark:hover:border-emerald-900/50">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Attendance Rate
              </span>
              <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
                {loading ? (
                  <Skeleton className="h-9 w-12 bg-slate-100 dark:bg-slate-800" />
                ) : (
                  `${metrics.rate}%`
                )}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-sm">
              <CheckCircle2 className="h-5 w-5 stroke-[1.75]" />
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-emerald-500/40" />
        </Card>

        {/* Late Incidents Card */}
        <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/50 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-amber-200 dark:hover:border-amber-900/50">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Late Incidents
              </span>
              <h3 className="text-3xl font-bold text-amber-600 dark:text-amber-400 tracking-tight font-mono">
                {loading ? (
                  <Skeleton className="h-9 w-12 bg-slate-100 dark:bg-slate-800" />
                ) : (
                  metrics.late
                )}
              </h3>
            </div>
            <div className="p-3 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl shadow-sm">
              <AlertTriangle className="h-5 w-5 stroke-[1.75]" />
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-amber-500/40" />
        </Card>

        {/* Absence Count Card */}
        <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/50 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-rose-200 dark:hover:border-rose-900/50">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Unexcused Absences
              </span>
              <h3 className="text-3xl font-bold text-rose-600 dark:text-rose-400 tracking-tight font-mono">
                {loading ? (
                  <Skeleton className="h-9 w-12 bg-slate-100 dark:bg-slate-800" />
                ) : (
                  metrics.absent
                )}
              </h3>
            </div>
            <div className="p-3 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl shadow-sm">
              <XCircle className="h-5 w-5 stroke-[1.75]" />
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-rose-500/40" />
        </Card>
      </div>

      {/* Control Filters Bar */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-[0_4px_12px_-4px_rgba(0,0,0,0.03)] space-y-5">
        <div>
          <h4 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200">
            Report Configurations
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Define constraints to isolate tracking histories.
          </p>
        </div>

        {/* Added min-w-0 to all child columns in this grid to prevent overflow expansion */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Department Selection */}
          <div className="md:col-span-3 min-w-0">
            <Label className="mb-2 block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Department
            </Label>
            <Select
              value={departmentId}
              onValueChange={(v) => setDepartmentId(v ?? "")}
            >
              {/* Force text truncation inside the SelectTrigger container */}
              <SelectTrigger className="w-full bg-slate-50/30 hover:bg-slate-50/80 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl transition-all duration-200 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-700 min-w-0 overflow-hidden [&>span]:line-clamp-1">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl max-h-64">
                {departments.map((d) => (
                  <SelectItem
                    key={d.id}
                    value={d.id}
                    className="rounded-lg my-0.5"
                  >
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Date Selector */}
          <div className="md:col-span-3 min-w-0">
            <Label className="mb-2 block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Start Boundary
            </Label>
            <Popover>
              <PopoverTrigger>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-slate-50/30 hover:bg-slate-50/80 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl transition-all duration-200 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-700 min-w-0",
                    !startDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span className="truncate">
                    {startDate ? format(startDate, "PP") : "Pick start date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl border-slate-200/80 dark:border-slate-800/80"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date Selector */}
          <div className="md:col-span-3 min-w-0">
            <Label className="mb-2 block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              End Boundary
            </Label>
            <div className="flex items-center gap-2 min-w-0">
              <Popover>
                <PopoverTrigger>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-slate-50/30 hover:bg-slate-50/80 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl transition-all duration-200 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-700 min-w-0",
                      !endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="truncate">
                      {endDate ? format(endDate, "PP") : "Pick end date"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl border-slate-200/80 dark:border-slate-800/80"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                  />
                </PopoverContent>
              </Popover>

              {(startDate || endDate) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setStartDate(undefined);
                    setEndDate(undefined);
                  }}
                  title="Reset date windows"
                  className="hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 shrink-0 rounded-xl border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700/60 transition-all h-9 w-9"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Export CSV CTA */}
          <div className="md:col-span-3 min-w-0">
            <Button
              onClick={handleExportCSV}
              disabled={loading || displayedRecords.length === 0}
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-950 rounded-xl font-medium shadow-sm active:scale-[0.99] transition-all duration-200 h-10 disabled:opacity-40 disabled:pointer-events-none truncate"
            >
              <Download className="mr-2 h-4 w-4 stroke-[2] inline" />
              Export Dataset
            </Button>
          </div>
        </div>
      </div>

      {/* Main Table Content Panel */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-850 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/[0.2] dark:bg-slate-900/[0.2] backdrop-blur-sm">
          <div className="space-y-0.5 min-w-0">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Attendance Records
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium font-mono">
              {displayedRecords.length} match filters
            </p>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-2.5 py-1 rounded-md shrink-0">
            Descending Sequence
          </div>
        </div>

        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-4 p-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-12 w-full bg-slate-50 dark:bg-slate-850 rounded-xl"
                />
              ))}
            </div>
          ) : displayedRecords.length === 0 ? (
            <div className="py-16 px-6">
              <EmptyState
                icon={Clock4}
                title="No logs match constraints"
                description={
                  startDate && endDate
                    ? `No telemetry records found inside the window of ${format(startDate, "P")} through ${format(endDate, "P")}.`
                    : "Configure data matrix vectors inside filter grid panel."
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
              <Table>
                <TableHeader className="bg-slate-50/40 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800">
                  <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                    <TableHead className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest py-4 px-6">
                      Staff Associate
                    </TableHead>
                    <TableHead className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest py-4">
                      Shift Classification
                    </TableHead>
                    <TableHead className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest py-4">
                      Clock In Entry
                    </TableHead>
                    <TableHead className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest py-4">
                      Clock Out Exit
                    </TableHead>
                    <TableHead className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest py-4">
                      Verified Status
                    </TableHead>
                    <TableHead className="text-right text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest py-4 px-6">
                      Administrative Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedRecords
                    .sort((a, b) => {
                      const dateA = new Date(
                        a.clockIn || a.createdAt || 0,
                      ).getTime();
                      const dateB = new Date(
                        b.clockIn || b.createdAt || 0,
                      ).getTime();
                      return dateB - dateA;
                    })
                    .map((r) => (
                      <TableRow
                        key={r.id}
                        className="group border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/[0.3] dark:hover:bg-slate-850/[0.2] transition-colors duration-150"
                      >
                        {/* User Column */}
                        <TableCell className="py-4 px-6">
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-slate-900 dark:text-slate-100 tracking-tight text-[13px] truncate">
                              {r.user?.firstName} {r.user?.lastName}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 tracking-tighter truncate">
                              UUID: {r.id.slice(-10).toUpperCase()}
                            </span>
                          </div>
                        </TableCell>

                        {/* Shift Column */}
                        <TableCell className="text-slate-600 dark:text-slate-400 font-medium text-[13px] py-4">
                          <span className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 px-2 py-0.5 rounded-md text-xs">
                            {r.shift?.shiftType?.name ?? "—"}
                          </span>
                        </TableCell>

                        {/* Clock In Column */}
                        <TableCell className="py-4 text-[13px]">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {formatTimeSafe(r.clockIn)}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                              {formatDateSafe(r.clockIn || r.createdAt)}
                            </span>
                          </div>
                        </TableCell>

                        {/* Clock Out Column */}
                        <TableCell className="py-4 text-[13px]">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {formatTimeSafe(r.clockOut)}
                            </span>
                            {r.clockOut ? (
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                                {formatDateSafe(r.clockOut)}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-300 dark:text-slate-600 font-mono italic mt-0.5">
                                Active session
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Status Column */}
                        <TableCell className="py-4">
                          <div className="inline-block transform scale-95 origin-left">
                            <StatusBadge status={r.status} />
                          </div>
                        </TableCell>

                        {/* Override Dropdown Column */}
                        <TableCell className="text-right py-4 px-6">
                          <Select
                            value={r.status}
                            onValueChange={(v) =>
                              v && handleOverride(r.id, v as AttendanceStatus)
                            }
                            disabled={updatingId === r.id}
                          >
                            <SelectTrigger className="ml-auto w-28 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all h-8 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-700 shadow-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl shadow-xl min-w-[7rem]">
                              {STATUS_OPTIONS.map((s) => (
                                <SelectItem
                                  key={s}
                                  value={s}
                                  className="rounded-lg text-xs my-0.5"
                                >
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
