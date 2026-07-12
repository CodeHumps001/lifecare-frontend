"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, UserX, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usersApi, departmentsApi, authApi, ApiError } from "@/lib/api";
import type { CreateStaffPayload } from "@/lib/api";
import type { Department, Position, Role, User } from "@/lib/types";
import { initials, titleCase } from "@/lib/utils";

const ROLES: Role[] = ["SUPER_ADMIN", "DEPT_HEAD", "STAFF"];
const POSITIONS: Position[] = [
  "DOCTOR",
  "NURSE",
  "MIDWIFE",
  "PHARMACIST",
  "LAB_TECHNICIAN",
  "RECEPTIONIST",
  "ADMINISTRATOR",
  "OTHER",
];

const emptyForm: CreateStaffPayload = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "STAFF",
  position: "NURSE",
  departmentId: undefined,
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CreateStaffPayload>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [u, d] = await Promise.all([
        usersApi.list(),
        departmentsApi.list(),
      ]);
      setUsers(u);
      setDepartments(d);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to load staff",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleCreate = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      toast.error("First name, last name, email and password are required");
      return;
    }
    setSaving(true);
    try {
      await authApi.createStaff(form);
      toast.success(
        `Account created — ${form.firstName} will receive their login details by email`,
      );
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Failed to create staff account",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await usersApi.deactivate(id);
      toast.success("Staff member deactivated");
      load();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to deactivate",
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await usersApi.remove(id);
      toast.success("Staff member deleted");
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete");
    }
  };

  return (
    <div>
      <PageHeader
        title="Staff"
        description="Manage hospital staff accounts, roles, and department assignments."
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Staff Member</DialogTitle>
                <DialogDescription>
                  Creates their account and emails them their login credentials.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="space-y-2">
                  <Label>First name</Label>
                  <Input
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last name</Label>
                  <Input
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Temporary password</Label>
                  <Input
                    type="text"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Shared with the staff member by email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={form.role}
                    onValueChange={(v) =>
                      v && setForm({ ...form, role: v as Role })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {titleCase(r)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Select
                    value={form.position}
                    onValueChange={(v) =>
                      v && setForm({ ...form, position: v as Position })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {POSITIONS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {titleCase(p)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Department</Label>
                  <Select
                    value={form.departmentId}
                    onValueChange={(v) =>
                      setForm({ ...form, departmentId: v ?? undefined })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={saving}>
                  {saving ? "Creating…" : "Create account"}
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
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={UsersIcon}
                title="No staff yet"
                description="Add your first staff member to get started."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {initials(u.firstName, u.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {u.firstName} {u.lastName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{titleCase(u.role)}</TableCell>
                    <TableCell>
                      {u.position ? titleCase(u.position) : "—"}
                    </TableCell>
                    <TableCell>{u.department?.name ?? "—"}</TableCell>
                    <TableCell>
                      <StatusBadge
                        status={u.isActive ? "ACTIVE" : "INACTIVE"}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {u.isActive && (
                        <ConfirmDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Deactivate"
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          }
                          title={`Deactivate ${u.firstName} ${u.lastName}?`}
                          description="They will no longer be able to log in or be scheduled for shifts."
                          confirmLabel="Deactivate"
                          onConfirm={() => handleDeactivate(u.id)}
                        />
                      )}
                      <ConfirmDialog
                        trigger={
                          <Button variant="ghost" size="icon" title="Delete">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        }
                        title={`Delete ${u.firstName} ${u.lastName}?`}
                        description="This permanently removes their account, profile, and leave balances. This cannot be undone."
                        confirmLabel="Delete"
                        onConfirm={() => handleDelete(u.id)}
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
