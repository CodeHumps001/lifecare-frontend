"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  Users,
  Award,
  Heart,
  TrendingUp,
  CalendarDays,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import { jobsAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";

const jobTypeBadge: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  INTERNSHIP: "Internship",
  CONTRACT: "Contract",
};

const jobTypColor: Record<string, string> = {
  FULL_TIME: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  PART_TIME: "bg-blue-50 text-blue-700 border border-blue-100",
  INTERNSHIP: "bg-purple-50 text-purple-700 border border-purple-100",
  CONTRACT: "bg-amber-50 text-amber-700 border border-amber-100",
};

const fallbackJobs = [
  {
    id: "1",
    title: "Staff Nurse",
    department: "Maternity",
    type: "FULL_TIME",
    description:
      "We are looking for a qualified and experienced staff nurse to join our maternity ward.",
    createdAt: "2024-10-01",
    isOpen: true,
  },
  {
    id: "2",
    title: "Medical Laboratory Scientist",
    department: "Laboratory",
    type: "FULL_TIME",
    description:
      "Join our laboratory team and help deliver accurate diagnostic services.",
    createdAt: "2024-10-05",
    isOpen: true,
  },
  {
    id: "3",
    title: "Pharmacist",
    department: "Pharmacy",
    type: "FULL_TIME",
    description:
      "We need a licensed pharmacist to manage our pharmacy operations.",
    createdAt: "2024-09-20",
    isOpen: true,
  },
];

const perks = [
  {
    icon: Award,
    title: "Modern Facility",
    desc: "Work in a clean, state-of-the-art medical hospital infrastructure.",
  },
  {
    icon: Heart,
    title: "Supportive Team",
    desc: "Collaborate alongside an exceptionally dedicated medical guild.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    desc: "Clear organizational path for structured professional milestones.",
  },
  {
    icon: CalendarDays,
    title: "Structured Shifts",
    desc: "Highly transparent scheduling prioritizing mental equilibrium.",
  },
  {
    icon: GraduationCap,
    title: "Ongoing Training",
    desc: "Continuous internal modules and funded clinical workshops.",
  },
  {
    icon: ShieldCheck,
    title: "Community Impact",
    desc: "Deliver high-tier healthcare solutions where it counts the most.",
  },
];

export default function CareersPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    jobsAPI
      .getAll()
      .then((res) => {
        const data = res?.data?.data || [];
        setJobs(data.length > 0 ? data : fallbackJobs);
      })
      .catch(() => setJobs(fallbackJobs))
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen">
      {/* ── HIGH-END CINEMATIC HERO ─────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950 py-24 px-4 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center bg-white/10 text-emerald-300 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full backdrop-blur-md">
            Clinical Opportunities
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none">
            Build Your Career at <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-emerald-400">
              Divine Netcare
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Join an ecosystem anchored on premium diagnostic integrity and
            clinical empathy. Elevate your medical or administrative practice in
            a top-tier space.
          </p>

          <div className="max-w-md mx-auto relative pt-4">
            <Search className="absolute left-4 top-1/2 translate-y-0.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search positions or specialist units..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all text-base shadow-xl border border-slate-200/20"
            />
          </div>
        </div>
      </section>

      {/* ── VALUE PROPOSITION PERKS ────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-emerald-700 text-xs font-bold tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-md">
            Cultural Pillars
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            An Elite Workspace Environment
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div
                key={i}
                className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex items-start gap-4"
              >
                <div className="p-3 bg-slate-50 rounded-xl text-emerald-600 border border-slate-100 shrink-0">
                  <Icon className="w-5 h-5 stroke-[1.75]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {perk.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-normal">
                    {perk.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── VACANCIES FEED LISTING ──────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200/60">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Active Vacancies
            <span className="ml-3 text-xs sm:text-sm font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
              {filtered.length} positions open
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm animate-pulse space-y-3"
              >
                <div className="h-5 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-100 rounded w-1/4" />
                <div className="h-4 bg-slate-50 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm max-w-md mx-auto">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4 stroke-[1.5]" />
            <p className="text-slate-900 font-bold">
              No active positions found.
            </p>
            <p className="text-slate-500 text-sm mt-1 mb-4 font-normal">
              Our dynamic pipeline shifts quickly. Modify your filters or
              trigger a resume broadcast.
            </p>
            <button
              onClick={() => setSearch("")}
              className="text-emerald-600 text-xs font-bold hover:underline"
            >
              Reset search criteria
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-slate-200/60 hover:border-slate-300/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-extrabold text-lg text-slate-950 group-hover:text-emerald-700 transition-colors tracking-tight">
                      {job.title}
                    </h3>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${jobTypColor[job.type] || "bg-slate-100 text-slate-600"}`}
                    >
                      {jobTypeBadge[job.type] || job.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-slate-600">
                      <Users className="w-3.5 h-3.5" /> {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> Kumasi, GH
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />{" "}
                      {formatDate(job.createdAt)}
                    </span>
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed font-normal max-w-2xl">
                    {job.description}
                  </p>
                </div>

                <Link
                  href={`/careers/${job.id}`}
                  className="w-full md:w-auto text-center inline-flex items-center justify-center gap-2 bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs tracking-wider uppercase px-5 py-3.5 rounded-xl shadow-sm shrink-0 group-hover:bg-emerald-700 transition-colors"
                >
                  Apply Now{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* ── SPONTANEOUS APPLICATION SECTION ────────────── */}
        <div className="mt-16 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 rounded-3xl p-8 sm:p-10 text-center sm:text-left relative overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Don't See a Matching Role?
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                Submit a spontaneous profile transmission. We monitor our talent
                directory continuously for unexpected expansions.
              </p>
            </div>

            <a
              href="mailto:andrewdarkwah123@gmail.com?subject=Spontaneous Application — Divine Netcare Hospital"
              className="w-full sm:w-auto text-center inline-flex items-center justify-center bg-white text-slate-950 hover:bg-slate-50 text-xs font-bold tracking-wider uppercase px-6 py-4 rounded-xl transition-all shadow-md shrink-0"
            >
              Broadcast Resume
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
