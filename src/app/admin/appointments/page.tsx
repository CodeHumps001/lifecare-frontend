"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarCheck2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
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
import { appointmentsApi, ApiError } from "@/lib/api";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const STATUS_OPTIONS: AppointmentStatus[] = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setAppointments(await appointmentsApi.list());
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to load appointments",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    setUpdatingId(id);
    try {
      const updated = await appointmentsApi.updateStatus(id, status);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: updated.status } : a)),
      );
      toast.success("Status updated — patient notified by SMS/email");
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
        title="Appointments"
        description="All patient bookings across the hospital."
      />

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={CalendarCheck2}
                title="No appointments yet"
                description="Bookings from the public site will appear here."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell>
                      <p className="font-medium">{appt.patientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {appt.patientPhone}
                      </p>
                    </TableCell>
                    <TableCell>
                      Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                      {appt.reason}
                    </TableCell>
                    <TableCell>{formatDate(appt.date)}</TableCell>
                    <TableCell>
                      <StatusBadge status={appt.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={appt.status}
                        onValueChange={(v) =>
                          v &&
                          handleStatusChange(appt.id, v as AppointmentStatus)
                        }
                        disabled={updatingId === appt.id}
                      >
                        <SelectTrigger className="ml-auto w-36">
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
