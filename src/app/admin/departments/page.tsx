"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Users,
  X,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { departmentsAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  // Custom Modal States (Shadcn replacements for confirm & alert)
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorNotification, setErrorNotification] = useState<string | null>(
    null,
  );
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<{
    name: string;
    minStaffPerShift: number;
  }>();

  const load = () => {
    setLoading(true);
    departmentsAPI
      .getAll()
      .then((res) => setDepartments(res.data.data))
      .catch(() =>
        setDepartments([
          {
            id: "1",
            name: "Records",
            _count: { users: 3 },
            minStaffPerShift: 2,
            createdAt: "2024-01-01",
          },
          {
            id: "2",
            name: "Maternity",
            _count: { users: 8 },
            minStaffPerShift: 4,
            createdAt: "2024-01-01",
          },
          {
            id: "3",
            name: "Pharmacy",
            _count: { users: 5 },
            minStaffPerShift: 3,
            createdAt: "2024-01-01",
          },
        ]),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      if (editing) {
        await departmentsAPI.update(editing.id, data);
        setSuccess("Department records updated successfully.");
      } else {
        await departmentsAPI.create(data);
        setSuccess("New department registered successfully.");
      }
      reset();
      setShowForm(false);
      setEditing(null);
      load();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setErrorNotification(
        err.response?.data?.message || "Unable to save configuration updates.",
      );
    }
  };

  const handleEdit = (dept: any) => {
    setEditing(dept);
    setValue("name", dept.name);
    setValue("minStaffPerShift", dept.minStaffPerShift || 1);
    setShowForm(true);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await departmentsAPI.delete(deleteId);
      setSuccess("Department has been removed from the registry.");
      setDeleteId(null);
      load();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setErrorNotification(
        err.response?.data?.message ||
          "This department cannot be removed while active personnel are assigned.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-10">
      {/* Structural Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark tracking-tight">
            Departments
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">
            Configure institutional units and personnel floor limits.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            reset();
          }}
          className="bg-brand-primary text-white hover:bg-brand-primary/90 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" /> Register Department
        </button>
      </div>

      {/* Floating Status Notification Toast */}
      {success && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-white border border-emerald-100 text-emerald-800 rounded-2xl p-4 shadow-xl max-w-md animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold tracking-tight">{success}</p>
        </div>
      )}

      {/* Main Grid Content Allocation */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse h-40"
            />
          ))}
        </div>
      ) : departments.length === 0 ? (
        <div className="bg-white border border-gray-150 rounded-2xl p-16 text-center shadow-sm">
          <Building2 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-xs font-bold text-brand-dark">
            No operational departments recorded
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Begin by creating a new institutional framework branch.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex flex-col justify-between min-h-[160px]"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-9 h-9 bg-brand-light border border-brand-primary/5 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-brand-primary" />
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="p-1.5 hover:bg-white rounded-md transition-all text-gray-400 hover:text-brand-primary hover:shadow-sm"
                      title="Modify configuration"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(dept.id)}
                      className="p-1.5 hover:bg-white rounded-md transition-all text-gray-400 hover:text-rose-600 hover:shadow-sm"
                      title="De-register department"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-brand-dark text-base tracking-tight truncate">
                  {dept.name}
                </h3>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1 font-medium">
                  <Users className="w-3.5 h-3.5 text-gray-300" />
                  <span>{dept._count?.users || 0} Active Personnel</span>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-3 mt-4 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                <span>
                  Floor Minimum:{" "}
                  <strong className="text-brand-dark font-bold">
                    {dept.minStaffPerShift || 1} / shift
                  </strong>
                </span>
                <span className="text-gray-300">
                  Est. {formatDate(dept.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SHADCN DIALOG: Create / Edit Department Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-md animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
              <h2 className="text-base font-bold text-brand-dark tracking-tight">
                {editing ? "Modify Unit Details" : "Register Department"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                  Department Name <span className="text-rose-500">*</span>
                </label>
                <input
                  {...register("name", {
                    required: "Department designation name is required",
                  })}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-brand-primary transition-colors placeholder:text-gray-300"
                  placeholder="e.g., General Outpatients, Pharmacy, Emergency"
                />
                {errors.name && (
                  <p className="text-rose-500 text-xs mt-1 font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                  Shift Allocation Capacity Floor
                </label>
                <input
                  {...register("minStaffPerShift", { valueAsNumber: true })}
                  type="number"
                  min={1}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-brand-primary transition-colors"
                  defaultValue={1}
                />
                <p className="text-gray-400 text-[11px] mt-1.5 leading-normal">
                  Specifies the absolute minimum number of rostered staff
                  required to preserve duty coverage safety levels.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-50 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  className="w-full border border-gray-200 hover:bg-gray-50 text-xs font-bold text-brand-dark py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full bg-brand-primary text-white hover:bg-brand-primary/90 text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm"
                >
                  {editing ? "Apply Modifications" : "Save Record Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHADCN ALERT DIALOG: Confirmation Modal Backdrop */}
      {deleteId && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-sm text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-brand-dark tracking-tight">
              De-register Department?
            </h3>
            <p className="text-gray-400 text-xs mt-1.5 px-2 leading-relaxed">
              This action will remove the structural unit configuration registry
              block. This modification cannot be reverted.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
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

      {/* SHADCN ALERT DIALOG: Action Exception Message Board Overlay */}
      {errorNotification && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-sm text-center animate-in zoom-in-95 duration-150">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3.5 border border-amber-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-brand-dark tracking-tight">
              System Notice Exception
            </h3>
            <p className="text-gray-400 text-xs mt-1.5 leading-normal px-1">
              {errorNotification}
            </p>
            <button
              type="button"
              onClick={() => setErrorNotification(null)}
              className="mt-5 w-full bg-brand-dark hover:bg-brand-dark/90 text-white text-xs font-semibold py-2 rounded-xl transition-colors"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
