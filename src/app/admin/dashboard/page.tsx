"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  Calendar,
  Clock,
  FileText,
  Briefcase,
  Star,
  TrendingUp,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import {
  departmentsAPI,
  usersAPI,
  appointmentsAPI,
  jobsAPI,
  reviewsAPI,
  leaveAPI,
} from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    users: 0,
    departments: 0,
    appointments: 0,
    pendingLeave: 0,
    openJobs: 0,
    pendingReviews: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      usersAPI.getAll(),
      departmentsAPI.getAll(),
      appointmentsAPI.getAll(),
      jobsAPI.getAll(),
      reviewsAPI.getApproved(),
      leaveAPI.getDepartmentLeave(),
    ])
      .then(([users, depts, appts, jobs, reviews, leave]) => {
        setStats({
          users:
            users.status === "fulfilled" ? users.value.data.data.length : 0,
          departments:
            depts.status === "fulfilled" ? depts.value.data.data.length : 0,
          appointments:
            appts.status === "fulfilled" ? appts.value.data.data.length : 0,
          openJobs:
            jobs.status === "fulfilled" ? jobs.value.data.data.length : 0,
          pendingReviews: 0,
          pendingLeave:
            leave.status === "fulfilled"
              ? leave.value.data.data.filter((l: any) => l.status === "PENDING")
                  .length
              : 0,
        });
        if (appts.status === "fulfilled") {
          setRecentAppointments(appts.value.data.data.slice(0, 5));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const quickActions = [
    { label: "Staff Directory", href: "/admin/users", icon: Users },
    { label: "Scheduling", href: "/admin/shifts", icon: Calendar },
    { label: "Recruitment", href: "/admin/jobs", icon: Briefcase },
    { label: "Notices", href: "/admin/announcements", icon: Bell },
    { label: "Insights", href: "/admin/posts", icon: TrendingUp },
    { label: "Attendance", href: "/admin/attendance", icon: Clock },
  ];

  const statCards = [
    {
      label: "Staff Members",
      value: stats.users,
      icon: Users,
      href: "/admin/users",
    },
    {
      label: "Departments",
      value: stats.departments,
      icon: Building2,
      href: "/admin/departments",
    },
    {
      label: "Scheduled Appointments",
      value: stats.appointments,
      icon: Calendar,
      href: "/admin/appointments",
    },
    {
      label: "Pending Leave",
      value: stats.pendingLeave,
      icon: FileText,
      href: "/admin/leave",
    },
    {
      label: "Open Positions",
      value: stats.openJobs,
      icon: Briefcase,
      href: "/admin/jobs",
    },
    {
      label: "Pending Reviews",
      value: stats.pendingReviews,
      icon: Star,
      href: "/admin/reviews",
    },
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-brand-dark">Dashboard</h1>
        <p className="text-gray-500 font-medium">
          Welcome back, {user?.firstName}. Here is an overview of hospital
          operations.
        </p>
      </div>

      {/* Operational Tabs */}
      <nav className="flex items-center gap-2 p-1.5 bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-brand-dark hover:bg-gray-50 whitespace-nowrap transition-colors"
          >
            <action.icon className="w-4 h-4 text-brand-primary" />
            {action.label}
          </Link>
        ))}
      </nav>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-brand-primary transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-5 h-5 text-gray-400 group-hover:text-brand-primary" />
            </div>
            <div className="text-3xl font-bold text-brand-dark">
              {loading ? "—" : stat.value}
            </div>
            <div className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">
              {stat.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-brand-dark">
            Recent Patient Appointments
          </h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">
            Loading records...
          </div>
        ) : recentAppointments.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No recent activity to display.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentAppointments.map((appt) => (
              <div
                key={appt.id}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-brand-dark">
                    {appt.patientName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {appt.patientPhone} • {formatDate(appt.date)}
                  </p>
                </div>
                <div className="text-xs font-bold px-3 py-1 bg-gray-50 rounded-full border border-gray-100 uppercase tracking-wide">
                  {appt.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
