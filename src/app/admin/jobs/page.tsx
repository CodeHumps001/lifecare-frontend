"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Briefcase,
  ExternalLink,
  Clock,
  CheckCircle2,
  FileText,
  TrendingUp,
  Inbox,
  Sparkles,
  Layers,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "@/components/ui/dialog";
import { jobsApi, ApiError } from "@/lib/api";
import type { JobListingPayload } from "@/lib/api";
import type {
  ApplicationStatus,
  JobApplication,
  JobListing,
  JobType,
} from "@/lib/types";
import { formatDate, titleCase } from "@/lib/utils";

const JOB_TYPES: JobType[] = [
  "FULL_TIME",
  "PART_TIME",
  "INTERNSHIP",
  "CONTRACT",
];
const APPLICATION_STATUSES: ApplicationStatus[] = [
  "PENDING",
  "REVIEWED",
  "SHORTLISTED",
  "REJECTED",
];

const emptyForm: JobListingPayload = {
  title: "",
  department: "",
  type: "FULL_TIME",
  description: "",
};

// Simple visual extraction helper for single-string applicant names
const getInitials = (name?: string) => {
  if (!name) return "AP";
  const parts = name.trim().split(" ");
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? "";
  return (first + last).toUpperCase();
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);

  // Safe-fetch utility wrapper to parse envelope-wrapped responses
  const extractArray = (response: any): any[] => {
    if (Array.isArray(response)) return response;
    if (response && typeof response === "object") {
      const anyRes = response as any;
      if (Array.isArray(anyRes.data)) return anyRes.data;
      if (anyRes.status === "success" && Array.isArray(anyRes.data))
        return anyRes.data;
      if (anyRes.jobs && Array.isArray(anyRes.jobs)) return anyRes.jobs;
      if (anyRes.applications && Array.isArray(anyRes.applications))
        return anyRes.applications;
      const possibleArray = Object.values(anyRes).find((val) =>
        Array.isArray(val),
      );
      if (possibleArray) return possibleArray as any[];
    }
    return [];
  };

  const loadListings = async () => {
    setLoadingJobs(true);
    try {
      const res = await jobsApi.list();
      setJobs(extractArray(res));
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to load job listings",
      );
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await jobsApi.applications.list();
      setApplications(extractArray(res));
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to load applications",
      );
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    loadListings();
    loadApplications();
  }, []);

  const activePositions = jobs.filter((j) => j.isOpen).length;
  const pendingApps = applications.filter((a) => a.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* ── HEADER CONTAINER ────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 pb-5">
        <PageHeader
          title="Talent Acquisition"
          description="Build out institutional career paths, update vacancy status, and assess candidate portfolios."
        />
      </div>

      {/* ── EXECUTIVE ANALYTICS INSIGHTS CARDS ───────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="border-slate-200/60 shadow-xs bg-white rounded-2xl overflow-hidden relative group hover:border-emerald-300 transition-all duration-300">
          <div className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Active Vacancies
              </p>
              <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {activePositions}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-[3px] bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Card>

        <Card className="border-slate-200/60 shadow-xs bg-white rounded-2xl overflow-hidden relative group hover:border-amber-300 transition-all duration-300">
          <div className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Pending App Reviews
              </p>
              <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {pendingApps}
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-500">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-[3px] bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Card>

        <Card className="border-slate-200/60 shadow-xs bg-white rounded-2xl overflow-hidden relative group hover:border-blue-300 transition-all duration-300">
          <div className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Applicant History
              </p>
              <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {applications.length}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-500">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-[3px] bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Card>
      </div>

      {/* ── WORKSPACE TABS WITH STACK CORRECTION ────────── */}
      <Tabs defaultValue="listings" className="flex flex-col w-full gap-5">
        {/* Navigation Tab List */}
        <div className="border-b border-slate-200 pb-1">
          <TabsList className="bg-slate-100/80 p-1 border border-slate-200/50 rounded-xl h-11 inline-flex">
            <TabsTrigger
              value="listings"
              className="rounded-lg text-xs font-bold px-4 py-2 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm"
            >
              <Layers className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Active Listings ({jobs.length})
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="rounded-lg text-xs font-bold px-4 py-2 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm"
            >
              <Inbox className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Applications Queue ({applications.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Listing Content window */}
        <TabsContent value="listings" className="mt-0 outline-none w-full">
          <ListingsTab
            jobs={jobs}
            loading={loadingJobs}
            refresh={loadListings}
          />
        </TabsContent>

        {/* Tab Applications Content window */}
        <TabsContent value="applications" className="mt-0 outline-none w-full">
          <ApplicationsTab
            applications={applications}
            loading={loadingApps}
            refresh={loadApplications}
            setApplications={setApplications}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   LISTINGS TAB COMPONENT
   ──────────────────────────────────────────────────────── */
interface ListingsProps {
  jobs: JobListing[];
  loading: boolean;
  refresh: () => Promise<void>;
}

function ListingsTab({ jobs, loading, refresh }: ListingsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<JobListing | null>(null);
  const [form, setForm] = useState<JobListingPayload>(emptyForm);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (job: JobListing) => {
    setEditing(job);
    setForm({
      title: job.title,
      department: job.department,
      type: job.type,
      description: job.description,
      isOpen: job.isOpen,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.department || !form.description) {
      toast.error("Title, department and description are required");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await jobsApi.update(editing.id, form);
        toast.success("Job listing updated");
      } else {
        await jobsApi.create(form);
        toast.success("Job listing created");
      }
      setDialogOpen(false);
      refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to save job listing",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleOpen = async (job: JobListing) => {
    try {
      await jobsApi.update(job.id, { isOpen: !job.isOpen });
      toast.success(
        `Position ${!job.isOpen ? "opened" : "closed"} successfully`,
      );
      refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to update listing",
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await jobsApi.remove(id);
      toast.success("Job listing deleted");
      refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to delete listing",
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <Button
            onClick={openCreate}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md h-10 px-4"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            New Listing
          </Button>
          <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden rounded-2xl border border-slate-200/80 shadow-2xl">
            <DialogHeader className="p-6 bg-slate-50/80 border-b border-slate-100">
              <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                {editing ? "Modify Vacancy Details" : "Create Career Listing"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 mt-1">
                Published positions will instantly become viewable on the public
                portal.
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-500 font-bold text-xs">
                    Title
                  </Label>
                  <Input
                    value={form.title}
                    placeholder="e.g., Clinical Pharmacist"
                    className="border-slate-200 text-xs h-10 focus-visible:ring-emerald-500"
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-500 font-bold text-xs">
                    Department
                  </Label>
                  <Input
                    value={form.department}
                    placeholder="e.g., Pharmacy"
                    className="border-slate-200 text-xs h-10 focus-visible:ring-emerald-500"
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-500 font-bold text-xs">Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    v && setForm({ ...form, type: v as JobType })
                  }
                >
                  <SelectTrigger className="border-slate-200 text-xs h-10 focus:ring-emerald-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {JOB_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">
                        {titleCase(t)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-500 font-bold text-xs">
                  Job Description
                </Label>
                <Textarea
                  rows={5}
                  value={form.description}
                  placeholder="Outline credentials, primary responsibilities, and expected shifts patterns..."
                  className="border-slate-200 text-xs focus-visible:ring-emerald-500 resize-none leading-relaxed"
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2 justify-end">
              <Button
                variant="ghost"
                className="text-slate-500 hover:bg-slate-100 text-xs font-semibold h-9 rounded-lg px-4"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold h-9 rounded-lg px-5"
              >
                {saving ? "Processing…" : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-xs border-slate-200 overflow-hidden rounded-2xl bg-white">
        <CardContent className="p-0">
          {loading ? (
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
          ) : jobs.length === 0 ? (
            <div className="py-16 px-4 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white to-slate-50/30">
              <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200/60 shadow-sm text-slate-400 mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">
                No Vacancies Listed
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                Your organizational career directory is currently empty. Get
                started by posting a listing.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/75 border-b border-slate-100">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider py-4 pl-6">
                      Vacancy Title
                    </TableHead>
                    <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                      Department
                    </TableHead>
                    <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                      Contract Type
                    </TableHead>
                    <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                      Date Posted
                    </TableHead>
                    <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                      Accepting Apps
                    </TableHead>
                    <TableHead className="text-right text-slate-500 font-bold text-xs uppercase tracking-wider pr-6">
                      Manage
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow
                      key={job.id}
                      className="group hover:bg-slate-50/40 transition-colors border-b border-slate-100 last:border-0"
                    >
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-600 font-semibold shadow-inner">
                            <Briefcase className="h-4 w-4 text-slate-500" />
                          </div>
                          <span className="font-semibold text-slate-800 tracking-tight text-[14px]">
                            {job.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 font-semibold text-xs">
                        {job.department}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-[11px] border border-blue-100/30">
                          {titleCase(job.type)}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-400 text-xs font-medium">
                        {formatDate(job.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={job.isOpen}
                          onCheckedChange={() => handleToggleOpen(job)}
                          className="data-[state=checked]:bg-emerald-600"
                        />
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                            onClick={() => openEdit(job)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <ConfirmDialog
                            trigger={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            }
                            title={`Delete listing: ${job.title}?`}
                            description="Removing this listing is permanent. Active applicants won't be able to view details."
                            confirmLabel="Delete Listing"
                            onConfirm={() => handleDelete(job.id)}
                          />
                        </div>
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

/* ────────────────────────────────────────────────────────
   APPLICATIONS TAB COMPONENT
   ──────────────────────────────────────────────────────── */
interface ApplicationsProps {
  applications: JobApplication[];
  loading: boolean;
  refresh: () => Promise<void>;
  setApplications: React.Dispatch<React.SetStateAction<JobApplication[]>>;
}

function ApplicationsTab({
  applications,
  loading,
  refresh,
  setApplications,
}: ApplicationsProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    setUpdatingId(id);
    try {
      await jobsApi.applications.updateStatus(id, status);
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a)),
      );
      if (status === "SHORTLISTED" || status === "REJECTED") {
        toast.success(
          `Applicant updated to ${status.toLowerCase()} — notified via SMS/Email.`,
        );
      } else {
        toast.success("Candidate file updated");
      }
      refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to update status",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Card className="shadow-xs border-slate-200 overflow-hidden rounded-2xl bg-white">
      <CardContent className="p-0">
        {loading ? (
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
        ) : applications.length === 0 ? (
          <div className="py-16 px-4 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white to-slate-50/30">
            <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200/60 shadow-sm text-slate-400 mb-4">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">
              No Candidates Yet
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
              When prospective talents apply from your public careers catalog,
              their complete profiles will arrive here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/75 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider py-4 pl-6">
                    Applicant
                  </TableHead>
                  <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                    Target Position
                  </TableHead>
                  <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                    Attached CV
                  </TableHead>
                  <TableHead className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                    Submission Date
                  </TableHead>
                  <TableHead className="text-right text-slate-500 font-bold text-xs uppercase tracking-wider pr-6">
                    Candidate File Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow
                    key={app.id}
                    className="group hover:bg-slate-50/40 transition-colors border-b border-slate-100 last:border-0"
                  >
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200/60 border border-slate-200/50 text-slate-700 font-bold text-xs shadow-inner">
                          {getInitials(app.name)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-slate-800 tracking-tight text-[14px]">
                            {app.name}
                          </span>
                          <span className="text-xs text-slate-400 mt-0.5 truncate">
                            {app.email} ·{" "}
                            <span className="font-medium text-slate-500">
                              {app.phone}
                            </span>
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-700 text-xs">
                          {app.jobListing?.title}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          {app.jobListing?.department}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <a
                        href={app.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-600 hover:text-slate-900 shadow-xs transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                        View CV
                        <ExternalLink className="h-3 w-3 text-slate-400 ml-0.5" />
                      </a>
                    </TableCell>

                    <TableCell className="text-slate-400 text-xs font-medium">
                      {formatDate(app.createdAt)}
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <Select
                        value={app.status}
                        onValueChange={(v) =>
                          v &&
                          handleStatusChange(app.id, v as ApplicationStatus)
                        }
                        disabled={updatingId === app.id}
                      >
                        <SelectTrigger className="ml-auto w-36 h-9 border-slate-200 text-xs rounded-xl focus:ring-emerald-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {APPLICATION_STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">
                              {titleCase(s)}
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
  );
}
