"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Clock4, Calendar as CalendarIcon, Download, X } from "lucide-react";
import { format, isValid } from "date-fns";
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
import { formatDateTime, cn } from "@/lib/utils";

const STATUS_OPTIONS: AttendanceStatus[] = ["PRESENT", "LATE", "ABSENT"];

export default function AttendancePage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Set default initial date to today
  const [exportDate, setExportDate] = useState<Date | undefined>(new Date());

  // Safe matching helper to prevent timezone offsets from shifting records across midnights
  const isMatchingDate = (
    record: AttendanceRecord,
    targetDate: Date,
  ): boolean => {
    const dateStr = record.clockIn || record.createdAt;
    if (!dateStr) return false;

    const recordDate = new Date(dateStr);
    if (!isValid(recordDate)) return false;

    const rYear = recordDate.getFullYear();
    const rMonth = recordDate.getMonth();
    const rDate = recordDate.getDate();

    const rYearUTC = recordDate.getUTCFullYear();
    const rMonthUTC = recordDate.getUTCMonth();
    const rDateUTC = recordDate.getUTCDate();

    const tYear = targetDate.getFullYear();
    const tMonth = targetDate.getMonth();
    const tDate = targetDate.getDate();

    const matchesLocal =
      rYear === tYear && rMonth === tMonth && rDate === tDate;
    const matchesUTC =
      rYearUTC === tYear && rMonthUTC === tMonth && rDateUTC === tDate;

    return matchesLocal || matchesUTC;
  };

  // Client-side safety filter applied on top of server payload
  const displayedRecords = exportDate
    ? records.filter((r) => isMatchingDate(r, exportDate))
    : records;

  // 1. Initial Load: Fetch available departments
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

  // 2. Fetch attendance records: Triggers on both department changes AND calendar selections
  useEffect(() => {
    if (!departmentId) return;

    setLoading(true);

    // Format selected calendar date to 'YYYY-MM-DD' to query the backend database
    const dateParam = exportDate ? format(exportDate, "yyyy-MM-dd") : undefined;

    attendanceApi
      .byDepartment(departmentId, dateParam)
      .then((data) => {
        setRecords(data || []);
      })
      .catch((err) =>
        toast.error(
          err instanceof ApiError ? err.message : "Failed to load attendance",
        ),
      )
      .finally(() => setLoading(false));
  }, [departmentId, exportDate]);

  const handleOverride = async (id: string, status: AttendanceStatus) => {
    setUpdatingId(id);
    try {
      const updated = await attendanceApi.manualOverride(id, status);
      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: updated.status } : r)),
      );
      toast.success("Attendance status updated");
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
      toast.error(
        exportDate
          ? `No attendance records found for ${format(exportDate, "PP")}`
          : "No attendance records available to export",
      );
      return;
    }

    const headers = [
      "Staff Name",
      "Department",
      "Shift Type",
      "Clock In",
      "Clock Out",
      "Status",
    ];

    const rows = displayedRecords.map((r) => [
      `${r.user?.firstName ?? ""} ${r.user?.lastName ?? ""}`.trim(),
      deptName,
      r.shift?.shiftType?.name ?? "—",
      r.clockIn ? formatDateTime(r.clockIn) : "—",
      r.clockOut ? formatDateTime(r.clockOut) : "—",
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
    const formattedFileDate = exportDate
      ? format(exportDate, "yyyy-MM-dd")
      : "all_dates";

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `attendance_${deptName.toLowerCase().replace(/\s+/g, "_")}_${formattedFileDate}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${displayedRecords.length} records!`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Geofenced clock-in/out records with manual override."
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full max-w-xs">
          <Label className="mb-2 block text-sm font-medium">Department</Label>
          <Select
            value={departmentId}
            onValueChange={(v) => setDepartmentId(v ?? "")}
          >
            <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">
              Filter Date / Export Target
            </Label>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal sm:w-[240px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100",
                      !exportDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {exportDate ? (
                      format(exportDate, "PPP")
                    ) : (
                      <span>All Dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  align="end"
                >
                  <Calendar
                    mode="single"
                    selected={exportDate}
                    onSelect={setExportDate}
                  />
                </PopoverContent>
              </Popover>

              {exportDate && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setExportDate(undefined)}
                  title="Clear date filter"
                  className="hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <Button
            onClick={handleExportCSV}
            disabled={loading || displayedRecords.length === 0}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-950 transition-colors"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-12 w-full bg-slate-100 dark:bg-slate-800"
                />
              ))}
            </div>
          ) : displayedRecords.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={Clock4}
                title="No attendance records"
                description={
                  exportDate
                    ? `No records found for ${format(exportDate, "PP")}.`
                    : "Nothing recorded for this department yet."
                }
              />
            </div>
          ) : (
            <Table>
              <TableHeader className="border-slate-200 dark:border-slate-800">
                <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                  <TableHead className="text-slate-500 dark:text-slate-400">
                    Staff
                  </TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400">
                    Shift
                  </TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400">
                    Clock In
                  </TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400">
                    Clock Out
                  </TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400">
                    Status
                  </TableHead>
                  <TableHead className="text-right text-slate-500 dark:text-slate-400">
                    Override
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
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-200 dark:border-slate-800"
                    >
                      <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                        {r.user?.firstName} {r.user?.lastName}
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-slate-400">
                        {r.shift?.shiftType?.name ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                        {r.clockIn ? formatDateTime(r.clockIn) : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                        {r.clockOut ? formatDateTime(r.clockOut) : "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={r.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={r.status}
                          onValueChange={(v) =>
                            v && handleOverride(r.id, v as AttendanceStatus)
                          }
                          disabled={updatingId === r.id}
                        >
                          <SelectTrigger className="ml-auto w-32 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                            {STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s} value={s}>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
