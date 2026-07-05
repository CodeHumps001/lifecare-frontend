"use client";
import { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  AlertTriangle,
  X,
} from "lucide-react";
import { leaveAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";

const statusConfig: Record<
  string,
  { color: string; icon: any; label: string }
> = {
  PENDING: {
    color: "bg-amber-50 text-amber-600 border border-amber-200",
    icon: Clock,
    label: "PENDING",
  },
  APPROVED: {
    color: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    icon: CheckCircle,
    label: "APPROVED",
  },
  REJECTED: {
    color: "bg-rose-50 text-rose-600 border border-rose-200",
    icon: XCircle,
    label: "REJECTED",
  },
};

const leaveTypeColor: Record<string, string> = {
  ANNUAL: "bg-blue-50 text-blue-600 border border-blue-100",
  SICK: "bg-red-50 text-red-600 border border-red-100",
  EMERGENCY: "bg-rose-50 text-rose-600 border border-rose-100",
  MATERNITY: "bg-pink-50 text-pink-600 border border-pink-100",
  PATERNITY: "bg-purple-50 text-purple-600 border border-purple-100",
};

interface ModalState {
  isOpen: boolean;
  id: string | null;
  status: string | null;
  staffName: string;
}

export default function AdminLeavePage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({});
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    id: null,
    status: null,
    staffName: "",
  });

  const load = () => {
    setLoading(true);
    leaveAPI
      .getDepartmentLeave()
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setLeaves(Array.isArray(data) ? data : []);
      })
      .catch(() =>
        setLeaves([
          {
            id: "1",
            leaveType: "ANNUAL",
            startDate: "2026-07-10",
            endDate: "2026-07-15",
            reason: "Family vacation",
            status: "PENDING",
            createdAt: "2026-06-28",
            user: { firstName: "Ama", lastName: "Mensah" },
          },
          {
            id: "2",
            leaveType: "SICK",
            startDate: "2026-07-05",
            endDate: "2026-07-07",
            reason: "Malaria treatment",
            status: "APPROVED",
            createdAt: "2026-07-01",
            user: { firstName: "Kofi", lastName: "Asante" },
          },
        ]),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openConfirmation = (
    id: string,
    status: string,
    firstName: string,
    lastName: string,
  ) => {
    setModal({
      isOpen: true,
      id,
      status,
      staffName: `${firstName} ${lastName}`,
    });
  };

  const confirmReview = async () => {
    if (!modal.id || !modal.status) return;

    const targetId = modal.id;
    const targetStatus = modal.status;

    setModal({ isOpen: false, id: null, status: null, staffName: "" });
    setReviewing(targetId);
    setErrorMessage(null);

    try {
      await leaveAPI.review(targetId, {
        status: targetStatus,
        reviewNote: reviewNote[targetId] || "",
      });
      load();
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || `Failed to update request status.`,
      );
    } finally {
      setReviewing(null);
    }
  };

  const filtered = leaves.filter(
    (l) => filterStatus === "ALL" || l.status === filterStatus,
  );

  const pending = leaves.filter((l) => l.status === "PENDING").length;
  const approved = leaves.filter((l) => l.status === "APPROVED").length;
  const rejected = leaves.filter((l) => l.status === "REJECTED").length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 relative bg-[#f8fafc] min-h-screen">
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex items-start gap-3 justify-between animate-in fade-in duration-200">
          <div className="flex gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-sm font-medium">{errorMessage}</div>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Section matching image_6e4c92.png */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Pending",
            value: pending,
            color: "bg-amber-50 text-amber-600 border border-amber-100",
            icon: Clock,
          },
          {
            label: "Approved",
            value: approved,
            color: "bg-emerald-50 text-emerald-600 border border-emerald-100",
            icon: CheckCircle,
          },
          {
            label: "Rejected",
            value: rejected,
            color: "bg-rose-50 text-rose-600 border border-rose-100",
            icon: XCircle,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-3xl p-6 border border-gray-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between min-h-[140px]"
          >
            <div
              className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center`}
            >
              <s.icon className="w-4 h-4" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-gray-900 tracking-tight">
                {s.value}
              </div>
              <div className="text-gray-400 text-sm mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2.5 pt-2">
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-5 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              filterStatus === s
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100/80"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Leave Cards List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse h-40"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">
            No leave applications found
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((leave) => {
            const cfg = statusConfig[leave.status] || statusConfig.PENDING;
            const Icon = cfg.icon;
            const days = Math.ceil(
              (new Date(leave.endDate).getTime() -
                new Date(leave.startDate).getTime()) /
                (1000 * 60 * 60 * 24),
            );

            return (
              <div
                key={leave.id}
                className={`bg-white rounded-3xl p-6 border border-gray-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.015)] border-l-4 transition-all ${
                  leave.status === "PENDING"
                    ? "border-l-amber-400"
                    : leave.status === "APPROVED"
                      ? "border-l-emerald-500"
                      : "border-l-rose-400"
                } ${reviewing === leave.id ? "opacity-60 pointer-events-none" : ""}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Column Content details matching image_6e4c92.png */}
                  <div className="flex-1 space-y-4">
                    {/* Header Identifiers */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm shadow-indigo-600/20">
                          {leave.user?.firstName?.[0]}
                          {leave.user?.lastName?.[0]}
                        </div>
                        <span className="font-bold text-gray-800 text-sm tracking-tight">
                          {leave.user?.firstName} {leave.user?.lastName}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-lg uppercase ${leaveTypeColor[leave.leaveType]}`}
                      >
                        {leave.leaveType} LEAVE
                      </span>

                      <span
                        className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1 ${cfg.color}`}
                      >
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </div>

                    {/* Meta Timestamps Row */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500/80" />
                        From:{" "}
                        <span className="text-gray-500">
                          {formatDate(leave.startDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500/80" />
                        To:{" "}
                        <span className="text-gray-500">
                          {formatDate(leave.endDate)}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-700">{days}</span>{" "}
                        days
                      </div>
                      <div className="text-gray-300">
                        Applied: {formatDate(leave.createdAt)}
                      </div>
                    </div>

                    {/* Reason Panel Wrapper */}
                    <div className="bg-gray-50/60 rounded-xl px-4 py-2.5 border border-gray-100/50 max-w-2xl">
                      <p className="text-gray-500 text-xs leading-relaxed">
                        <span className="font-bold text-gray-700 mr-1">
                          Reason:
                        </span>
                        {leave.reason}
                      </p>
                    </div>
                  </div>

                  {/* Actions Right Hand Column Area */}
                  <div className="w-full lg:w-80 shrink-0 flex flex-col justify-end">
                    {leave.status === "PENDING" ? (
                      <div className="space-y-2.5 w-full">
                        <textarea
                          placeholder="Review note (optional)..."
                          value={reviewNote[leave.id] || ""}
                          onChange={(e) =>
                            setReviewNote((prev) => ({
                              ...prev,
                              [leave.id]: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-200/80 bg-gray-50/50 rounded-2xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none h-14 transition-all text-gray-600"
                        />
                        <div className="flex gap-2.5">
                          <button
                            onClick={() =>
                              openConfirmation(
                                leave.id,
                                "APPROVED",
                                leave.user?.firstName,
                                leave.user?.lastName,
                              )
                            }
                            disabled={reviewing === leave.id}
                            className="flex-1 flex items-center gap-1.5 justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm shadow-emerald-600/10 active:scale-[0.98]"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() =>
                              openConfirmation(
                                leave.id,
                                "REJECTED",
                                leave.user?.firstName,
                                leave.user?.lastName,
                              )
                            }
                            disabled={reviewing === leave.id}
                            className="flex-1 flex items-center gap-1.5 justify-center bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm shadow-rose-600/10 active:scale-[0.98]"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-right lg:pr-4">
                        <span className="text-xs font-bold text-gray-400 italic bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                          Processed Application
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal Container */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-gray-100 scale-in animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  modal.status === "APPROVED"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : "bg-rose-50 text-rose-600 border border-rose-100"
                }`}
              >
                {modal.status === "APPROVED" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
              </div>
              <h3 className="font-bold text-gray-900 text-base tracking-tight">
                Confirm Review Action
              </h3>
            </div>

            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Are you sure you want to change the status of{" "}
              <span className="font-bold text-gray-800">
                {modal.staffName}&apos;s
              </span>{" "}
              leave request to{" "}
              <span
                className={`font-bold ${modal.status === "APPROVED" ? "text-emerald-600" : "text-rose-600"}`}
              >
                {modal.status}
              </span>
              ? This will modify the backend files instantly.
            </p>

            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() =>
                  setModal({
                    isOpen: false,
                    id: null,
                    status: null,
                    staffName: "",
                  })
                }
                className="px-4 py-2 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReview}
                className={`px-4 py-2 text-white font-bold text-xs rounded-xl transition-all shadow-sm ${
                  modal.status === "APPROVED"
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10"
                    : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/10"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
