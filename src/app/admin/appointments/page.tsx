"use client";
import { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Phone,
  FileText,
  AlertTriangle,
  X,
} from "lucide-react";
import { appointmentsAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";

const statusOptions = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

// Standardized Green Palette Consistency
const statusConfig: Record<
  string,
  { color: string; icon: any; label: string }
> = {
  PENDING: {
    color: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    icon: AlertCircle,
    label: "PENDING",
  },
  CONFIRMED: {
    color: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    icon: Clock,
    label: "CONFIRMED",
  },
  COMPLETED: {
    color: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    icon: CheckCircle,
    label: "COMPLETED",
  },
  CANCELLED: {
    color: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    icon: XCircle,
    label: "CANCELLED",
  },
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [updating, setUpdating] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    appointmentsAPI
      .getAll()
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setAppointments(Array.isArray(data) ? data : []);
      })
      .catch(() =>
        setAppointments([
          {
            id: "1",
            patientName: "Kofi Mensah",
            patientPhone: "0244123456",
            reason: "General checkup",
            date: "2026-07-10",
            status: "PENDING",
            createdAt: "2026-07-01",
            doctor: { firstName: "Kwame", lastName: "Asante" },
          },
          {
            id: "2",
            patientName: "Ama Owusu",
            patientPhone: "0555987654",
            reason: "Prenatal visit",
            date: "2026-07-11",
            status: "CONFIRMED",
            createdAt: "2026-07-02",
            doctor: { firstName: "Abena", lastName: "Mensah" },
          },
        ]),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdating(id);
    setErrorMessage(null);
    try {
      await appointmentsAPI.updateStatus(id, status);
      load();
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || `Failed to update status.`,
      );
    } finally {
      setUpdating(null);
    }
  };

  const filtered = appointments.filter((a) => {
    const matchSearch =
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.patientPhone.includes(search);
    const matchStatus = filterStatus === "ALL" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

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

      {/* Stats Section with Consistent Green */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Pending",
            value: appointments.filter((a) => a.status === "PENDING").length,
          },
          {
            label: "Confirmed",
            value: appointments.filter((a) => a.status === "CONFIRMED").length,
          },
          {
            label: "Completed",
            value: appointments.filter((a) => a.status === "COMPLETED").length,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-3xl p-6 border border-gray-100/80 shadow-sm flex flex-col justify-between min-h-[140px]"
          >
            <div className="w-9 h-9 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
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

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap gap-2.5">
          {["ALL", ...statusOptions].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-5 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                filterStatus === s
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                  : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100/80"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl pl-11 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-gray-700 shadow-sm"
          />
        </div>
      </div>

      {/* Main List */}
      <div className="space-y-4">
        {filtered.map((appt) => {
          const cfg = statusConfig[appt.status] || statusConfig.PENDING;
          return (
            <div
              key={appt.id}
              className={`bg-white rounded-3xl p-6 border border-gray-100/80 shadow-sm border-l-4 ${updating === appt.id ? "opacity-60" : ""} border-l-emerald-500`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {appt.patientName?.[0]}
                    </div>
                    <span className="font-bold text-gray-800 text-sm">
                      {appt.patientName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${cfg.color}`}
                    >
                      {cfg.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      {appt.patientPhone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(appt.date)}
                    </span>
                  </div>
                </div>

                <div className="w-full lg:w-48">
                  <select
                    value={appt.status}
                    disabled={updating === appt.id}
                    onChange={(e) =>
                      handleStatusUpdate(appt.id, e.target.value)
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-emerald-700 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
