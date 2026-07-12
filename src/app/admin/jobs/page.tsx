"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Briefcase, ExternalLink } from "lucide-react";
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
  DialogTrigger,
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

export default function JobsPage() {
  return (
    <div>
      <PageHeader
        title="Careers"
        description="Manage job listings and review applications."
      />
      <Tabs defaultValue="listings">
        <TabsList>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="listings" className="mt-4">
          <ListingsTab />
        </TabsContent>
        <TabsContent value="applications" className="mt-4">
          <ApplicationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ListingsTab() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<JobListing | null>(null);
  const [form, setForm] = useState<JobListingPayload>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setJobs(await jobsApi.list());
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to load job listings",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
      load();
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
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, isOpen: !j.isOpen } : j)),
      );
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
      load();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to delete listing",
      );
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New Listing
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Job Listing" : "New Job Listing"}
              </DialogTitle>
              <DialogDescription>
                Published listings appear on the public careers page.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    v && setForm({ ...form, type: v as JobType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {titleCase(t)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
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
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={Briefcase}
                title="No job listings yet"
                description="Create your first listing above."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead>Open</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{titleCase(job.type)}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(job.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={job.isOpen}
                        onCheckedChange={() => handleToggleOpen(job)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(job)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        }
                        title={`Delete ${job.title}?`}
                        description="This cannot be undone."
                        confirmLabel="Delete"
                        onConfirm={() => handleDelete(job.id)}
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

function ApplicationsTab() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setApplications(await jobsApi.applications.list());
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to load applications",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    setUpdatingId(id);
    try {
      await jobsApi.applications.updateStatus(id, status);
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a)),
      );
      if (status === "SHORTLISTED" || status === "REJECTED") {
        toast.success("Status updated — applicant notified by SMS/email");
      } else {
        toast.success("Status updated");
      }
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to update status",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Briefcase}
              title="No applications yet"
              description="Applications submitted from the careers page will appear here."
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>CV</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <p className="font-medium">{app.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.email} · {app.phone}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{app.jobListing?.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.jobListing?.department}
                    </p>
                  </TableCell>
                  <TableCell>
                    <a
                      href={app.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(app.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={app.status}
                      onValueChange={(v) =>
                        v && handleStatusChange(app.id, v as ApplicationStatus)
                      }
                      disabled={updatingId === app.id}
                    >
                      <SelectTrigger className="ml-auto w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {APPLICATION_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
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
        )}
      </CardContent>
    </Card>
  );
}
