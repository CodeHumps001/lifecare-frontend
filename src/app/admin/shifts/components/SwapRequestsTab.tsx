// app/admin/shifts/components/SwapRequestsTab.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { shiftsApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface SwapRequestRow {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  requester: { firstName: string; lastName: string };
  targetStaff: { firstName: string; lastName: string };
  originalShift: { date: string; shiftType: { name: string } };
  targetShift: { date: string; shiftType: { name: string } };
}

interface SwapRequestsTabProps {
  departmentId: string;
}

export function SwapRequestsTab({ departmentId }: SwapRequestsTabProps) {
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
