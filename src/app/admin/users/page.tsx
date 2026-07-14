"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  UserX,
  Users as UsersIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

const ITEMS_PER_PAGE = 5;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CreateStaffPayload>(emptyForm);
  const [saving, setSaving] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const [u, d] = await Promise.all([
        usersApi.list(),
        departmentsApi.list(),
      ]);
      setUsers(u || []);
      setDepartments(d || []);
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

  // Recalibrate page index when dataset changes
  useEffect(() => {
    setCurrentPage(1);
  }, [users.length]);

  // Paginated Slicing Engine
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
    <div className="space-y-6 antialiased text-slate-900 dark:text-slate-50">
      <PageHeader
        title="Staff Directory"
        description="Manage clinical staff accounts, system access levels, and department assignments."
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button
                onClick={openCreate}
                className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-950 rounded-xl font-medium shadow-sm active:scale-[0.99] transition-all duration-200 h-10"
              >
                <Plus className="mr-2 h-4 w-4 stroke-[2.5]" />
                Add Staff Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  Add Staff Member
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400 dark:text-slate-500">
                  Creates their system access profile and emails them their
                  temporary login credentials.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    First name
                  </Label>
                  <Input
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/30 hover:bg-slate-50/80 dark:bg-slate-950/30 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Last name
                  </Label>
                  <Input
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/30 hover:bg-slate-50/80 dark:bg-slate-950/30 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/30 hover:bg-slate-50/80 dark:bg-slate-950/30 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Temporary Password
                  </Label>
                  <Input
                    type="text"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Will be dispatched automatically via email"
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/30 hover:bg-slate-50/80 dark:bg-slate-950/30 text-slate-900 dark:text-slate-100 placeholder:text-slate-400/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    System Role
                  </Label>
                  <Select
                    value={form.role}
                    onValueChange={(v) =>
                      v && setForm({ ...form, role: v as Role })
                    }
                  >
                    <SelectTrigger className="w-full bg-slate-50/30 hover:bg-slate-50/80 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl">
                      {ROLES.map((r) => (
                        <SelectItem
                          key={r}
                          value={r}
                          className="rounded-lg my-0.5"
                        >
                          {titleCase(r)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Position
                  </Label>
                  <Select
                    value={form.position}
                    onValueChange={(v) =>
                      v && setForm({ ...form, position: v as Position })
                    }
                  >
                    <SelectTrigger className="w-full bg-slate-50/30 hover:bg-slate-50/80 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl max-h-64">
                      {POSITIONS.map((p) => (
                        <SelectItem
                          key={p}
                          value={p}
                          className="rounded-lg my-0.5"
                        >
                          {titleCase(p)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Department Link
                  </Label>
                  <Select
                    value={form.departmentId}
                    onValueChange={(v) =>
                      setForm({ ...form, departmentId: v ?? undefined })
                    }
                  >
                    <SelectTrigger className="w-full bg-slate-50/30 hover:bg-slate-50/80 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl transition-all duration-200">
                      <SelectValue placeholder="Unassigned / Floating Staff" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl max-h-64">
                      {departments.map((d) => (
                        <SelectItem
                          key={d.id}
                          value={d.id}
                          className="rounded-lg my-0.5"
                        >
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-4 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={saving}
                  className="rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-950 transition-all font-semibold"
                >
                  {saving ? "Creating Profile…" : "Generate Account"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.02)] rounded-2xl overflow-hidden">
        {/* Compact, clean card header */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/[0.1] dark:bg-slate-900/[0.1]">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Roster Records
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium font-mono">
              {users.length} registered accounts
            </p>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-2 py-0.5 rounded-md">
            Active Directory
          </div>
        </div>

        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-10 w-full bg-slate-50 dark:bg-slate-950 rounded-xl"
                />
              ))}
            </div>
          ) : paginatedUsers.length === 0 ? (
            <div className="py-12 px-6">
              <EmptyState
                icon={UsersIcon}
                title="Roster directory is empty"
                description="Add your first staff member to activate this catalog."
              />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table className="w-full table-fixed">
                  <TableHeader className="bg-slate-50/40 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800">
                    <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                      {/* Explicit column width bounds to prevent shifting */}
                      <TableHead className="w-[30%] text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest py-3 px-6">
                        Staff Associate
                      </TableHead>
                      <TableHead className="w-[15%] text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest py-3">
                        System Role
                      </TableHead>
                      <TableHead className="w-[20%] text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest py-3">
                        Professional Position
                      </TableHead>
                      <TableHead className="w-[18%] text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest py-3">
                        Department Link
                      </TableHead>
                      <TableHead className="w-[12%] text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest py-3">
                        Status
                      </TableHead>
                      <TableHead className="w-[5%] text-right text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest py-3 px-6">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((u) => (
                      <TableRow
                        key={u.id}
                        className="group border-slate-105 dark:border-slate-800/60 hover:bg-slate-50/[0.2] dark:hover:bg-slate-800/[0.1] transition-colors duration-150"
                      >
                        {/* Profile Info */}
                        <TableCell className="py-2.5 px-6">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-8 w-8 rounded-full border border-slate-200/55 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-sm shrink-0">
                              <AvatarFallback className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                {initials(u.firstName, u.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <span className="font-semibold text-slate-900 dark:text-slate-100 tracking-tight text-[13px] truncate">
                                {u.firstName} {u.lastName}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 tracking-tighter truncate">
                                {u.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* System Role */}
                        <TableCell className="py-2.5 text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                          {titleCase(u.role)}
                        </TableCell>

                        {/* Position */}
                        <TableCell className="py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-300">
                          {u.position ? (
                            <span className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 px-2 py-0.5 rounded-md text-xs">
                              {titleCase(u.position)}
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-600">
                              —
                            </span>
                          )}
                        </TableCell>

                        {/* Department */}
                        <TableCell className="py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-300">
                          {u.department?.name ? (
                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                              {u.department.name}
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 italic text-xs">
                              Unassigned
                            </span>
                          )}
                        </TableCell>

                        {/* Status Badge */}
                        <TableCell className="py-2.5">
                          <div className="inline-block transform scale-90 origin-left">
                            <StatusBadge
                              status={u.isActive ? "ACTIVE" : "INACTIVE"}
                            />
                          </div>
                        </TableCell>

                        {/* Actions buttons */}
                        <TableCell className="text-right py-2.5 px-6">
                          <div className="flex items-center justify-end gap-1 shrink-0">
                            {u.isActive && (
                              <ConfirmDialog
                                trigger={
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Deactivate Account"
                                    className="hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 h-8 w-8 rounded-xl transition-all border border-transparent hover:border-slate-200/40 dark:hover:border-slate-750/50"
                                  >
                                    <UserX className="h-4 w-4 stroke-[1.75]" />
                                  </Button>
                                }
                                title={`Deactivate ${u.firstName} ${u.lastName}?`}
                                description="They will no longer be able to access the central registry, manage schedules, or log in."
                                confirmLabel="Deactivate"
                                onConfirm={() => handleDeactivate(u.id)}
                              />
                            )}
                            <ConfirmDialog
                              trigger={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Delete Profile"
                                  className="hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 h-8 w-8 rounded-xl transition-all border border-transparent hover:border-rose-100/30 dark:hover:border-rose-900/30"
                                >
                                  <Trash2 className="h-4 w-4 stroke-[1.75]" />
                                </Button>
                              }
                              title={`Delete ${u.firstName} ${u.lastName}?`}
                              description="This completely removes their access profiles and scheduled shifts. This action cannot be undone."
                              confirmLabel="Delete Profile"
                              onConfirm={() => handleDelete(u.id)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Tightly aligned, cohesive Pagination Control Bar */}
              {totalPages > 1 && (
                <div className="px-6 py-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/[0.05] dark:bg-slate-950/[0.05]">
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    Showing{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                      {startIndex + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                      {Math.min(startIndex + ITEMS_PER_PAGE, users.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                      {users.length}
                    </span>{" "}
                    entries
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl h-8 px-3 font-medium text-xs transition-all disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-lg font-mono">
                        {currentPage}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 px-1 font-mono">
                        / {totalPages}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl h-8 px-3 font-medium text-xs transition-all disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Next
                      <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
