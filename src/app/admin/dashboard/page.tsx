"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  CalendarCheck2,
  ClipboardList,
  Star,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";
import {
  usersApi,
  departmentsApi,
  appointmentsApi,
  reviewsApi,
  jobsApi,
} from "@/lib/api";
import type { Appointment, Review } from "@/lib/types";

interface Stats {
  staffCount: number;
  departmentCount: number;
  pendingAppointments: number;
  pendingReviews: number;
  openJobs: number;
  pendingApplications: number;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const isSuperAdmin = user?.role === "SUPER_ADMIN";

        const [staff, departments, appointments, reviews, jobs, applications] = await Promise.all([
          isSuperAdmin ? usersApi.list() : Promise.resolve([]),
          departmentsApi.list(),
          isSuperAdmin ? appointmentsApi.list() : Promise.resolve([]),
          isSuperAdmin ? reviewsApi.listApproved() : Promise.resolve([]),
          isSuperAdmin ? jobsApi.list() : Promise.resolve([]),
          isSuperAdmin ? jobsApi.applications.list() : Promise.resolve([]),
        ]);

        setStats({
          staffCount: staff.length,
          departmentCount: departments.length,
          pendingAppointments: appointments.filter((a) => a.status === "PENDING").length,
          pendingReviews: reviews.filter((r) => r.status === "PENDING").length,
          openJobs: jobs.filter((j) => j.isOpen).length,
          pendingApplications: applications.filter((a) => a.status === "PENDING").length,
        });
        setRecentAppointments(appointments.slice(0, 6));
      } catch {
        // dashboard is best-effort — individual pages surface their own errors
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.role]);

  const cards = [
    { label: "Active Staff", value: stats?.staffCount, icon: Users, href: "/admin/users" },
    { label: "Departments", value: stats?.departmentCount, icon: Building2, href: "/admin/departments" },
    { label: "Pending Appointments", value: stats?.pendingAppointments, icon: CalendarCheck2, href: "/admin/appointments" },
    { label: "Pending Reviews", value: stats?.pendingReviews, icon: Star, href: "/admin/reviews" },
    { label: "Open Job Listings", value: stats?.openJobs, icon: Briefcase, href: "/admin/jobs" },
    { label: "Pending Applications", value: stats?.pendingApplications, icon: ClipboardList, href: "/admin/jobs" },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.firstName ?? ""}`}
        description="Here's what's happening at Divine Netcare Hospital today."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  {loading ? (
                    <Skeleton className="mt-2 h-8 w-12" />
                  ) : (
                    <p className="mt-1 text-3xl font-semibold">{card.value ?? "—"}</p>
                  )}
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {user?.role === "SUPER_ADMIN" && (
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Appointments</CardTitle>
            <Link href="/admin/appointments" className="flex items-center gap-1 text-sm text-primary hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentAppointments.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No appointments yet.</p>
            ) : (
              <div className="space-y-3">
                {recentAppointments.map((appt) => (
                  <div key={appt.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{appt.patientName}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        Dr. {appt.doctor?.firstName} {appt.doctor?.lastName} · {formatDate(appt.date)}
                      </p>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
