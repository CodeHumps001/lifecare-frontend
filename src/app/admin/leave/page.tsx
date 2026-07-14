"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Check,
  X,
  ClipboardList,
  Clock,
  CheckCircle2,
  CalendarDays,
  FileText,
  UserCheck2,
  AlertCircle,
} from "lucide-react";
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
import { formatDate, titleCase, initials } from "@/lib/utils";

export default function LeavePage() {
  const [leave, setLeave] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewTarget, setReviewTarget] = useState<{
    app: LeaveApplication;
    decision: LeaveStatus;
  } | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const response = await leaveApi.byDepartment();
      console.log("Leave API Response:", response);

      let leaveData: LeaveApplication[] = [];

      // Highly robust payload scanner to handle any shape of API envelope responses
      if (Array.isArray(response)) {
        leaveData = response;
      } else if (response && typeof response === "object") {
        const anyRes = response as any;
        if (Array.isArray(anyRes.data)) {
          leaveData = anyRes.data;
        } else if (anyRes.status === "success" && Array.isArray(anyRes.data)) {
          leaveData = anyRes.data;
        } else if (anyRes.leaves && Array.isArray(anyRes.leaves)) {
          leaveData = anyRes.leaves;
        } else if (anyRes.applications && Array.isArray(anyRes.applications)) {
          leaveData = anyRes.applications;
        } else {
          // Fallback scanner to auto-extract any array found inside the response object
          const possibleArray = Object.values(anyRes).find((val) =>
            Array.isArray(val),
          );
          if (possibleArray) {
            leaveData = possibleArray as LeaveApplication[];
          }
        }
      }

      setLeave(leaveData);
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Failed to load leave applications",
      );
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
      await leaveApi.review(
        reviewTarget.app.id,
        reviewTarget.decision,
        note || undefined,
      );
      toast.success(`Leave application ${reviewTarget.decision.toLowerCase()}`);
      setReviewTarget(null);
      load();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to submit review",
      );
    } finally {
      setSaving(false);
    }
  };

  const pending = leave.filter((l) => l.status === "PENDING");
  const reviewed = leave.filter((l) => l.status !== "PENDING");
  const approvedCount = leave.filter((l) => l.status === "APPROVED").length;

  const renderTable = (rows: LeaveApplication[], showActions: boolean) => {
    if (loading) {
      return (
        <div className="divide-y divide-slate-100 p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col space-y-2 pt-2 first:pt-0 animate-pulse"
            >
              <Skeleton className="h-6 w-1/4 rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          ))}
        </div>
      );
    }
    if (rows.length === 0) {
      return (
        <div className="py-16 px-4 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white to-slate-50/30">
          <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200/60 shadow-sm text-slate-400 mb-4">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">
            No Requests Found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
            There are currently no leave applications in this view. All incoming
            staff tasks are fully resolved.
          </p>
        </div>
      );
    }
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/75 border-b border-slate-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider py-4 pl-6">
                Staff Member
              </TableHead>
              <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                Leave Category
              </TableHead>
              <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                Requested Period
              </TableHead>
              <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                Reason Details
              </TableHead>
              <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                Status
              </TableHead>
              {showActions && (
                <TableHead className="text-right text-slate-500 font-bold text-xs uppercase tracking-wider pr-6">
                  Decide
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((app) => (
              <TableRow
                key={app.id}
                className="group hover:bg-slate-50/40 transition-colors border-b border-slate-100 last:border-0"
              >
                <TableCell className="py-4 pl-6">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200/60 border border-slate-200/50 text-slate-700 font-bold text-xs shadow-inner">
                      {initials(app.user?.firstName, app.user?.lastName)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-slate-800 tracking-tight text-[14px]">
                        {app.user?.firstName} {app.user?.lastName}
                      </span>
                      <span className="text-xs text-slate-400 mt-0.5 truncate">
                        {app.user?.position
                          ? titleCase(app.user.position)
                          : "Staff"}{" "}
                        ·{" "}
                        <span className="font-medium text-slate-500">
                          {app.user?.department?.name}
                        </span>
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200/20">
                    {titleCase(app.leaveType)}
                  </span>
                </TableCell>

                <TableCell className="text-slate-600 font-medium text-xs whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      {formatDate(app.startDate)} – {formatDate(app.endDate)}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="max-w-[240px] truncate text-slate-500 text-xs py-4">
                  {app.reason ? (
                    <span title={app.reason}>{app.reason}</span>
                  ) : (
                    <span className="text-slate-300 italic">
                      No notes provided
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  <StatusBadge status={app.status} />
                </TableCell>

                {showActions && (
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 font-bold text-xs px-2.5 rounded-lg shadow-sm"
                        onClick={() => openReview(app, "REJECTED")}
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 bg-emerald-600 text-white hover:bg-emerald-500 font-bold text-xs px-2.5 rounded-lg shadow-sm"
                        onClick={() => openReview(app, "APPROVED")}
                      >
                        <Check className="h-3.5 w-3.5 mr-1 text-emerald-100" />
                        Approve
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER CONTAINER ────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 pb-5">
        <PageHeader
          title="Leave Administration"
          description="Moderate pending staff absence requests and review historical timelines."
        />
      </div>

      {/* ── EXECUTIVE ANALYTICS SUMMARY CARDS ───────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="border-slate-200/60 shadow-xs bg-white rounded-2xl overflow-hidden relative group hover:border-amber-300 transition-all duration-300">
          <div className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Pending Approvals
              </p>
              <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {pending.length}
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-500">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-[3px] bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Card>

        <Card className="border-slate-200/60 shadow-xs bg-white rounded-2xl overflow-hidden relative group hover:border-emerald-300 transition-all duration-300">
          <div className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Approved Absences
              </p>
              <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {approvedCount}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-[3px] bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Card>

        <Card className="border-slate-200/60 shadow-xs bg-white rounded-2xl overflow-hidden relative group hover:border-blue-300 transition-all duration-300">
          <div className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total History
              </p>
              <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {reviewed.length}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-500">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-[3px] bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Card>
      </div>

      {/* ── WORKSPACE TABS ────────────────────────────── */}
      <Tabs defaultValue="pending" className="flex flex-col w-full gap-5">
        {/* Navigation Row */}
        <div className="border-b border-slate-200 pb-1">
          <TabsList className="bg-slate-100/80 p-1 border border-slate-200/50 rounded-xl h-11 inline-flex">
            <TabsTrigger
              value="pending"
              className="rounded-lg text-xs font-bold px-4 py-2 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm"
            >
              Pending Queue ({pending.length})
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-lg text-xs font-bold px-4 py-2 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm"
            >
              Review History ({reviewed.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content Window Areas */}
        <TabsContent value="pending" className="mt-0 outline-none w-full">
          <Card className="shadow-xs border-slate-200 overflow-hidden rounded-2xl bg-white">
            <CardContent className="p-0">
              {renderTable(pending, true)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-0 outline-none w-full">
          <Card className="shadow-xs border-slate-200 overflow-hidden rounded-2xl bg-white">
            <CardContent className="p-0">
              {renderTable(reviewed, false)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── DECISION MODAL ─────────────────────────────── */}
      <Dialog
        open={!!reviewTarget}
        onOpenChange={(open) => !open && setReviewTarget(null)}
      >
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl border border-slate-200/80 shadow-2xl">
          <DialogHeader className="p-6 bg-slate-50/80 border-b border-slate-100 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-xl border ${
                  reviewTarget?.decision === "APPROVED"
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                    : "bg-rose-50 border-rose-100 text-rose-600"
                }`}
              >
                {reviewTarget?.decision === "APPROVED" ? (
                  <UserCheck2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>
              <DialogTitle className="text-lg font-bold text-slate-800">
                {reviewTarget?.decision === "APPROVED"
                  ? "Approve Leave Request"
                  : "Reject Leave Request"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-400 mt-2 leading-relaxed">
              Applying changes for{" "}
              <span className="font-bold text-slate-600">
                {reviewTarget?.app.user?.firstName}{" "}
                {reviewTarget?.app.user?.lastName}
              </span>
              . Category:{" "}
              <span className="font-semibold text-slate-600">
                {reviewTarget && titleCase(reviewTarget.app.leaveType)}
              </span>{" "}
              (
              {reviewTarget &&
                `${formatDate(reviewTarget.app.startDate)} – ${formatDate(reviewTarget.app.endDate)}`}
              ).
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4 bg-white">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-slate-300" />
                Administrative Note (Sent directly to applicant)
              </Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Briefly state guidelines, shifts assignments, or rejection context here..."
                className="min-h-[100px] border-slate-200 focus-visible:ring-emerald-500 resize-none text-slate-700 text-xs leading-relaxed"
              />
            </div>
          </div>

          <DialogFooter className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={() => setReviewTarget(null)}
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 text-xs font-semibold h-9 rounded-lg px-4"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={saving}
              className={`text-xs font-semibold h-9 rounded-lg px-5 text-white ${
                reviewTarget?.decision === "APPROVED"
                  ? "bg-emerald-600 hover:bg-emerald-500"
                  : "bg-rose-600 hover:bg-rose-500"
              }`}
            >
              {saving
                ? "Submitting…"
                : `Confirm ${reviewTarget?.decision === "APPROVED" ? "Approval" : "Rejection"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
