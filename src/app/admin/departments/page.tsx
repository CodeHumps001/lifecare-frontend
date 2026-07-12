"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { departmentsApi, ApiError } from "@/lib/api";
import type { Department } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [name, setName] = useState("");
  const [minStaffPerShift, setMinStaffPerShift] = useState(1);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setDepartments(await departmentsApi.list());
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to load departments",
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
    setName("");
    setMinStaffPerShift(1);
    setDialogOpen(true);
  };

  const openEdit = (dep: Department) => {
    setEditing(dep);
    setName(dep.name);
    setMinStaffPerShift(dep.minStaffPerShift || 1);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Department name is required");
      return;
    }
    if (!minStaffPerShift || minStaffPerShift < 1) {
      toast.error("Minimum staff per shift must be at least 1");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await departmentsApi.update(editing.id, name.trim(), minStaffPerShift);
        toast.success("Department updated");
      } else {
        await departmentsApi.create(name.trim(), minStaffPerShift);
        toast.success(
          "Department created — a group chat was set up automatically",
        );
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to save department",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await departmentsApi.remove(id);
      toast.success("Department deleted");
      load();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to delete department",
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="Departments"
        description="Manage hospital departments, staffing minimums, and shift cycles."
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                New Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Edit Department" : "New Department"}
                </DialogTitle>
                <DialogDescription>
                  {editing
                    ? "Update the department name."
                    : "Creates the department and automatically sets up its group chat."}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <Label htmlFor="dep-name">Department name</Label>
                <Input
                  id="dep-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Records"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dep-min-staff">
                  Minimum staff per working shift
                </Label>
                <Input
                  id="dep-min-staff"
                  type="number"
                  min={1}
                  value={minStaffPerShift}
                  onChange={(e) => setMinStaffPerShift(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  How many staff must cover each non-day-off shift type. This
                  drives auto-generated schedules — e.g. 2 working shift types ×
                  2 required each needs at least 4 staff in the department, with
                  the rest getting Off.
                </p>
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
        }
      />

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : departments.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={Building2}
                title="No departments yet"
                description="Create your first department to start organizing staff and shifts."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Min / Shift</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dep) => (
                  <TableRow key={dep.id}>
                    <TableCell className="font-medium">{dep.name}</TableCell>
                    <TableCell>{dep._count?.users ?? 0}</TableCell>
                    <TableCell>{dep.minStaffPerShift}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(dep.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(dep)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        }
                        title={`Delete ${dep.name}?`}
                        description="This cannot be undone. Staff, shifts, and shift types tied to this department will be affected."
                        confirmLabel="Delete"
                        onConfirm={() => handleDelete(dep.id)}
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
