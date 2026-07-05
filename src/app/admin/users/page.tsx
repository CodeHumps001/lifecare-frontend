"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Users,
  Plus,
  Search,
  Trash2,
  X,
  CheckCircle,
  UserX,
  UserCheck,
  Shield,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { usersAPI, departmentsAPI, authAPI } from "@/lib/api";
import {
  formatDate,
  getInitials,
  getPositionLabel,
  getRoleLabel,
} from "@/lib/utils";

const positions = [
  "DOCTOR",
  "NURSE",
  "MIDWIFE",
  "PHARMACIST",
  "LAB_TECHNICIAN",
  "RECEPTIONIST",
  "ADMINISTRATOR",
  "OTHER",
];
const roles = ["SUPER_ADMIN", "DEPT_HEAD", "STAFF"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Modals & Inline Overlay Triggers
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [statusToggleTarget, setStatusToggleTarget] = useState<any | null>(
    null,
  );
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const [success, setSuccess] = useState("");
  const [errorNotification, setErrorNotification] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>();

  const load = () => {
    setLoading(true);
    Promise.allSettled([usersAPI.getAll(), departmentsAPI.getAll()])
      .then(([u, d]) => {
        if (u.status === "fulfilled") setUsers(u.value.data.data);
        if (d.status === "fulfilled") setDepartments(d.value.data.data);
      })
      .catch(() => {
        setErrorNotification(
          "System error encountered while sync-retrieving registry data databases.",
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setErrorNotification(null);
    try {
      await authAPI.register(data);
      setSuccess(
        "Staff member registered successfully in the system directory.",
      );
      reset();
      setShowForm(false);
      load();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setErrorNotification(
        err.response?.data?.message ||
          "Registration operation rejected by database authority rules.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeStatusToggle = async () => {
    if (!statusToggleTarget) return;
    setIsChangingStatus(true);
    try {
      await usersAPI.deactivate(statusToggleTarget.id);
      setSuccess(`Personnel profile access state adjusted successfully.`);
      setStatusToggleTarget(null);
      load();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setErrorNotification(
        err.response?.data?.message ||
          "Status adjustment exception. Permissions check required.",
      );
    } finally {
      setIsChangingStatus(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await usersAPI.delete(deleteTarget.id);
      setSuccess(
        "Personnel profile completely removed from directory registry logs.",
      );
      setDeleteTarget(null);
      load();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setErrorNotification(
        err.response?.data?.message ||
          "Cannot delete user. Personnel profile may have historically archived record ties.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = users.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-10">
      {/* Institutional Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark tracking-tight">
            Staff Management
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">
            {users.length} registered personnel profiles currently indexed
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            reset();
          }}
          className="bg-brand-primary text-white hover:bg-brand-primary/90 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Register Staff
        </button>
      </div>

      {/* Dynamic Inline Search Field Restructuring */}
      <div className="relative bg-white p-1.5 border border-gray-200 rounded-xl shadow-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Filter roster by full name or institutional email registry..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none placeholder:text-gray-400 bg-transparent"
        />
      </div>

      {/* Floating Global Success Alert Notification Toast */}
      {success && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-white border border-emerald-100 text-emerald-800 rounded-2xl p-4 shadow-xl max-w-md animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold tracking-tight">{success}</p>
        </div>
      )}

      {/* Roster Output Layout Elements */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-9 h-9 bg-gray-100 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-100 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-xs font-bold text-brand-dark">
              No staff member profiles correspond with search query parameters
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Staff Profile
                  </th>
                  <th className="text-left px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Assignment Role
                  </th>
                  <th className="text-left px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Department Branch
                  </th>
                  <th className="text-left px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Security Access
                  </th>
                  <th className="text-left px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    System Status
                  </th>
                  <th className="text-right px-6 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((user, index) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                            [
                              "bg-emerald-600",
                              "bg-blue-600",
                              "bg-purple-600",
                              "bg-cyan-600",
                              "bg-rose-600",
                            ][index % 5]
                          }`}
                        >
                          {getInitials(user.firstName, user.lastName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-brand-dark text-sm tracking-tight truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-gray-400 text-xs truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-xs font-semibold text-gray-700">
                        {getPositionLabel(user.position)}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-xs font-semibold text-gray-600">
                        {user.department?.name || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600">
                        <Shield className="w-3 h-3 text-brand-primary" />
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md tracking-wide uppercase border ${
                          user.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}
                      >
                        {user.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100 max-w-max ml-auto">
                        <button
                          onClick={() => setStatusToggleTarget(user)}
                          title={
                            user.isActive
                              ? "Suspend operational profile privileges"
                              : "Reinstate structural clearance status"
                          }
                          className={`p-1.5 rounded-md transition-all ${
                            user.isActive
                              ? "text-gray-400 hover:text-amber-600 hover:bg-white hover:shadow-sm"
                              : "text-gray-400 hover:text-emerald-600 hover:bg-white hover:shadow-sm"
                          }`}
                        >
                          {user.isActive ? (
                            <UserX className="w-3.5 h-3.5" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          title="Purge profile data files completely"
                          className="p-1.5 rounded-md transition-all text-gray-400 hover:text-rose-600 hover:bg-white hover:shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SHADCN DIALOG: Register Staff Form Overlay Screen */}
      {showForm && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-lg my-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
              <h2 className="text-base font-bold text-brand-dark tracking-tight">
                Register Staff Member
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    {...register("firstName", { required: true })}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-brand-primary transition-colors"
                    placeholder="Given name"
                  />
                  {errors.firstName && (
                    <p className="text-rose-500 text-xs mt-1 font-medium">
                      Required field
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    {...register("lastName", { required: true })}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-brand-primary transition-colors"
                    placeholder="Surname"
                  />
                  {errors.lastName && (
                    <p className="text-rose-500 text-xs mt-1 font-medium">
                      Required field
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                  Institutional Email Address{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-brand-primary transition-colors"
                  placeholder="name.surname@netcare.org"
                />
                {errors.email && (
                  <p className="text-rose-500 text-xs mt-1 font-medium">
                    Valid identity parameters required
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                  Temporary Access Code Password{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  {...register("password", { required: true, minLength: 8 })}
                  type="password"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-brand-primary transition-colors"
                  placeholder="Minimum 8 credential values"
                />
                {errors.password && (
                  <p className="text-rose-500 text-xs mt-1 font-medium">
                    Requires at least 8 verification symbols
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                    System Privilege Level{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <select
                    {...register("role", { required: true })}
                    className="w-full text-sm border border-gray-200 bg-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-brand-primary transition-colors cursor-pointer"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {getRoleLabel(r)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                    Operational Assignment{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <select
                    {...register("position", { required: true })}
                    className="w-full text-sm border border-gray-200 bg-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-brand-primary transition-colors cursor-pointer"
                  >
                    {positions.map((p) => (
                      <option key={p} value={p}>
                        {getPositionLabel(p)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                  Structural Unit Department Allocation
                </label>
                <select
                  {...register("departmentId")}
                  className="w-full text-sm border border-gray-200 bg-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-brand-primary transition-colors cursor-pointer"
                >
                  <option value="">
                    — Independent Central Administration —
                  </option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-50 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                  className="w-full border border-gray-200 hover:bg-gray-50 text-xs font-bold text-brand-dark py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-primary text-white hover:bg-brand-primary/90 text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Verify and Enlist Profile"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHADCN ALERT DIALOG: Status Toggle Control Overlay Confirmation Screen */}
      {statusToggleTarget && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-sm text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-brand-dark tracking-tight">
              {statusToggleTarget.isActive
                ? "Suspend Access Privileges?"
                : "Reinstate Access Privileges?"}
            </h3>
            <p className="text-gray-400 text-xs mt-1.5 px-1 leading-relaxed">
              Adjusting clearance limits blocks or enables dashboard entry for{" "}
              <strong className="text-brand-dark font-semibold">
                {statusToggleTarget.firstName} {statusToggleTarget.lastName}
              </strong>{" "}
              across institutional framework sectors.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStatusToggleTarget(null)}
                disabled={isChangingStatus}
                className="w-full border border-gray-200 hover:bg-gray-50 text-xs font-bold text-brand-dark py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel Action
              </button>
              <button
                type="button"
                onClick={executeStatusToggle}
                disabled={isChangingStatus}
                className="w-full bg-brand-dark text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isChangingStatus ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Confirm Revision"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHADCN ALERT DIALOG: Purge Confirmation Overlay Screen */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-sm text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-brand-dark tracking-tight">
              Purge Personnel Profile?
            </h3>
            <p className="text-gray-400 text-xs mt-1.5 px-2 leading-relaxed">
              This action completely wipes the data block configuration for{" "}
              <strong className="text-brand-dark font-semibold">
                {deleteTarget.firstName} {deleteTarget.lastName}
              </strong>{" "}
              from active directories. This step cannot be reverted.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="w-full border border-gray-200 hover:bg-gray-50 text-xs font-bold text-brand-dark py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel Action
              </button>
              <button
                type="button"
                onClick={executeDelete}
                disabled={isDeleting}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Confirm Removal"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL ADMINISTRATIVE SYSTEM NOTICE OVERSIGHT BOARD OVERLAY SCREEN */}
      {errorNotification && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-sm text-center animate-in zoom-in-95 duration-150">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3.5 border border-amber-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-brand-dark tracking-tight">
              System Notification Exception
            </h3>
            <p className="text-gray-400 text-xs mt-1.5 leading-normal px-1">
              {errorNotification}
            </p>
            <button
              type="button"
              onClick={() => setErrorNotification(null)}
              className="mt-5 w-full bg-brand-dark hover:bg-brand-dark/90 text-white text-xs font-semibold py-2 rounded-xl transition-colors"
            >
              Acknowledge Block
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
