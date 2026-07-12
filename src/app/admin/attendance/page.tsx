"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Clock4 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { formatDateTime } from "@/lib/utils";

const STATUS_OPTIONS: AttendanceStatus[] = ["PRESENT", "LATE", "ABSENT"];

export default function AttendancePage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
      .then(setRecords)
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
      toast.success("Attendance status updated");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to update status",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Geofenced clock-in/out records with manual override."
      />

      <div className="mb-6 max-w-xs">
        <Label className="mb-2 block">Department</Label>
        <Select
          value={departmentId}
          onValueChange={(v) => setDepartmentId(v ?? "")}
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
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={Clock4}
                title="No attendance records"
                description="Nothing recorded for this department yet."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Override</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">
                        {r.user?.firstName} {r.user?.lastName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.shift?.shiftType?.name ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {r.clockIn ? formatDateTime(r.clockIn) : "—"}
                      </TableCell>
                      <TableCell className="text-sm">
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
                          <SelectTrigger className="ml-auto w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
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
