"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, X, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "@/components/ui/dialog";
import { leaveApi, ApiError } from "@/lib/api";
import type { LeaveApplication, LeaveStatus } from "@/lib/types";
import { formatDate, titleCase } from "@/lib/utils";

export default function LeavePage() {
  const [leave, setLeave] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewTarget, setReviewTarget] = useState<{ app: LeaveApplication; decision: LeaveStatus } | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setLeave(await leaveApi.byDepartment());
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load leave applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openReview = (app: LeaveApplication, decision: LeaveStatus) => {
    setReviewTarget({ app, decision });
    setNote("");
  };

  const handleSubmitReview = async () => {
    if (!reviewTarget) return;
    setSaving(true);
    try {
      await leaveApi.review(reviewTarget.app.id, reviewTarget.decision, note || undefined);
      toast.success(`Leave application ${reviewTarget.decision.toLowerCase()}`);
      setReviewTarget(null);
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to submit review");
    } finally {
      setSaving(false);
    }
  };

  const pending = leave.filter((l) => l.status === "PENDING");
  const reviewed = leave.filter((l) => l.status !== "PENDING");

  const renderTable = (rows: LeaveApplication[], showActions: boolean) => {
    if (loading) {
      return (
        <div className="space-y-3 p-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }
    if (rows.length === 0) {
      return (
        <div className="p-6">
          <EmptyState icon={ClipboardList} title="Nothing here" description="No leave applications in this view." />
        </div>
      );
    }
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((app) => (
            <TableRow key={app.id}>
              <TableCell>
                <p className="font-medium">
                  {app.user?.firstName} {app.user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {app.user?.position ? titleCase(app.user.position) : ""} · {app.user?.department?.name}
                </p>
              </TableCell>
              <TableCell>{titleCase(app.leaveType)}</TableCell>
              <TableCell className="text-sm">
                {formatDate(app.startDate)} – {formatDate(app.endDate)}
              </TableCell>
              <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{app.reason}</TableCell>
              <TableCell>
                <StatusBadge status={app.status} />
              </TableCell>
              {showActions && (
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openReview(app, "APPROVED")}>
                    <Check className="h-4 w-4 text-emerald-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openReview(app, "REJECTED")}>
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div>
      <PageHeader title="Leave Applications" description="Review and decide on staff leave requests." />

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardContent className="p-0">{renderTable(pending, true)}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardContent className="p-0">{renderTable(reviewed, false)}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!reviewTarget} onOpenChange={(open) => !open && setReviewTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewTarget?.decision === "APPROVED" ? "Approve" : "Reject"} leave application
            </DialogTitle>
            <DialogDescription>
              {reviewTarget?.app.user?.firstName} {reviewTarget?.app.user?.lastName} ·{" "}
              {reviewTarget && titleCase(reviewTarget.app.leaveType)} ·{" "}
              {reviewTarget && `${formatDate(reviewTarget.app.startDate)} – ${formatDate(reviewTarget.app.endDate)}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>Note (optional)</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note for the staff member…" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewTarget(null)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReview} disabled={saving}>
              {saving ? "Submitting…" : `Confirm ${reviewTarget?.decision === "APPROVED" ? "approval" : "rejection"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
