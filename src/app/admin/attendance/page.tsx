"use client";
import { useEffect, useState } from "react";
import {
  Clock,
  Search,
  CheckCircle,
  AlertCircle,
  XCircle,
  Building2,
} from "lucide-react";
import { attendanceAPI, departmentsAPI } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/utils";

const statusConfig: Record<
  string,
  { color: string; icon: any; label: string }
> = {
  PRESENT: {
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
    label: "Present",
  },
  LATE: {
    color: "bg-amber-100 text-amber-700",
    icon: AlertCircle,
    label: "Late",
  },
  ABSENT: { color: "bg-red-100 text-red-700", icon: XCircle, label: "Absent" },
};

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [overriding, setOverriding] = useState<string | null>(null);

  useEffect(() => {
    departmentsAPI
      .getAll()
      .then((res) => {
        // Safe check for direct arrays or wrapped response objects
        const data = res.data?.data || res.data || [];
        setDepartments(Array.isArray(data) ? data : []);
      })
      .catch(() =>
        setDepartments([
          { id: "d1", name: "Records" },
          { id: "d2", name: "Maternity" },
          { id: "d3", name: "Pharmacy" },
        ]),
      );
  }, []);

  useEffect(() => {
    if (!selectedDept) return;
    setLoading(true);
    attendanceAPI
      .getDepartmentAttendance(selectedDept)
      .then((res) => {
        // Safe check for attendance database payloads
        const data = res.data?.data || res.data || [];
        setRecords(Array.isArray(data) ? data : []);
      })
      .catch(() =>
        setRecords([
          {
            id: "a1",
            status: "PRESENT",
            clockIn: "2026-07-01T06:02:00",
            clockOut: "2026-07-01T14:05:00",
            clockInLatitude: 5.6037,
            clockInLongitude: -0.187,
            user: { firstName: "Ama", lastName: "Mensah" },
            shift: {
              date: "2026-07-01",
              shiftType: { name: "Day", startTime: "06:00", endTime: "14:00" },
            },
          },
          {
            id: "a2",
            status: "LATE",
            clockIn: "2026-07-01T06:35:00",
            clockOut: null,
            user: { firstName: "Kofi", lastName: "Asante" },
            shift: {
              date: "2026-07-01",
              shiftType: { name: "Day", startTime: "06:00", endTime: "14:00" },
            },
          },
          {
            id: "a3",
            status: "ABSENT",
            clockIn: null,
            clockOut: null,
            user: { firstName: "Abena", lastName: "Owusu" },
            shift: {
              date: "2026-07-01",
              shiftType: {
                name: "Night",
                startTime: "22:00",
                endTime: "06:00",
              },
            },
          },
        ]),
      )
      .finally(() => setLoading(false));
  }, [selectedDept]);

  const handleOverride = async (id: string, status: string) => {
    setOverriding(id);
    try {
      await attendanceAPI.manualOverride(id, status);
      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r)),
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Override failed");
    } finally {
      setOverriding(null);
    }
  };

  const filtered = records.filter((r) => {
    const firstName = r.user?.firstName || "";
    const lastName = r.user?.lastName || "";
    const matchSearch = `${firstName} ${lastName}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const present = records.filter((r) => r.status === "PRESENT").length;
  const late = records.filter((r) => r.status === "LATE").length;
  const absent = records.filter((r) => r.status === "ABSENT").length;

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-dark">
          Attendance Records
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Monitor staff attendance and apply manual overrides
        </p>
      </div>

      {/* Department selector */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-brand-secondary" />
          <label className="text-sm font-medium text-brand-dark">
            Select Department
          </label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="input-field max-w-xs border border-gray-200 rounded-xl p-2 bg-gray-50 text-sm"
          >
            <option value="">— Choose Department —</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedDept && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Present",
                value: present,
                color: "bg-green-100 text-green-700",
                icon: CheckCircle,
              },
              {
                label: "Late",
                value: late,
                color: "bg-amber-100 text-amber-700",
                icon: AlertCircle,
              },
              {
                label: "Absent",
                value: absent,
                color: "bg-red-100 text-red-700",
                icon: XCircle,
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl shadow-card p-5"
              >
                <div
                  className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}
                >
                  <s.icon className="w-5 h-5" />
                </div>
                <div className="font-display font-bold text-2xl text-brand-dark">
                  {s.value}
                </div>
                <div className="text-gray-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-11 w-full border border-gray-200 rounded-xl p-2 bg-gray-50 text-sm"
              />
            </div>
            <div className="flex gap-2">
              {["ALL", "PRESENT", "LATE", "ABSENT"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    filterStatus === s
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <Clock className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">No attendance records found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      {[
                        "Staff",
                        "Date",
                        "Shift",
                        "Clock In",
                        "Clock Out",
                        "Status",
                        "Override",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((record) => {
                      const cfg =
                        statusConfig[record.status] || statusConfig.ABSENT;
                      const Icon = cfg.icon;
                      return (
                        <tr
                          key={record.id}
                          className="hover:bg-gray-50/80 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {record.user?.firstName?.[0]}
                                {record.user?.lastName?.[0]}
                              </div>
                              <span className="font-medium text-brand-dark text-sm">
                                {record.user?.firstName} {record.user?.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500">
                            {record.shift?.date
                              ? formatDate(record.shift.date)
                              : "—"}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500">
                            {record.shift?.shiftType?.name || "—"}
                            {record.shift?.shiftType?.startTime && (
                              <span className="text-xs text-gray-400 block">
                                {record.shift.shiftType.startTime}–
                                {record.shift.shiftType.endTime}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500">
                            {record.clockIn ? formatTime(record.clockIn) : "—"}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500">
                            {record.clockOut
                              ? formatTime(record.clockOut)
                              : "—"}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}
                            >
                              <Icon className="w-3 h-3" /> {cfg.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <select
                              value={record.status}
                              disabled={overriding === record.id}
                              onChange={(e) =>
                                handleOverride(record.id, e.target.value)
                              }
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-600 bg-white"
                            >
                              <option value="PRESENT">PRESENT</option>
                              <option value="LATE">LATE</option>
                              <option value="ABSENT">ABSENT</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {!selectedDept && (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center border border-gray-100">
          <Clock className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            Select a department to view attendance records
          </p>
        </div>
      )}
    </div>
  );
}
