"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Calendar, Star, Stethoscope, Sparkles } from "lucide-react";
import { usersAPI } from "@/lib/api";

const positionLabels: Record<string, string> = {
  DOCTOR: "Medical Doctor",
  NURSE: "Registered Nurse",
  MIDWIFE: "Certified Midwife",
  PHARMACIST: "Pharmacist",
  LAB_TECHNICIAN: "Lab Technician",
};

// Fluid gradients for dynamic initial avatars instead of flat backgrounds
const avatarGradients = [
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-fuchsia-600",
  "from-teal-500 to-cyan-600",
  "from-slate-700 to-slate-900",
];

const fallbackDoctors = [
  {
    id: "1",
    firstName: "Kwame",
    lastName: "Asante",
    position: "DOCTOR",
    department: { name: "Outpatient Department (OPD)" },
  },
  {
    id: "2",
    firstName: "Abena",
    lastName: "Mensah",
    position: "DOCTOR",
    department: { name: "Maternity & Delivery" },
  },
  {
    id: "3",
    firstName: "Kofi",
    lastName: "Boateng",
    position: "DOCTOR",
    department: { name: "Surgical Services" },
  },
  {
    id: "4",
    firstName: "Ama",
    lastName: "Owusu",
    position: "DOCTOR",
    department: { name: "Eye Clinic" },
  },
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    usersAPI
      .getAll()
      .then((res) => {
        const docs =
          res?.data?.data?.filter((u: any) => u.position === "DOCTOR") || [];
        setDoctors(docs.length > 0 ? docs : fallbackDoctors);
      })
      .catch((err) => {
        // Prevent middleware/interceptor redirects from breaking the public view
        console.warn(
          "Public Fetch redirected or blocked by auth session. rendering fallbacks.",
          err,
        );
        setDoctors(fallbackDoctors);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = doctors.filter((d) =>
    `${d.firstName} ${d.lastName}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen">
      {/* ── MODERN COMBINED HERO ──────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950 py-24 px-4 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
        <div className="absolute -top-40 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-emerald-300 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 fill-current" /> Expert Specialists
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none">
            Meet Our Doctors
          </h1>
          <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Our experienced and compassionate medical practitioners are
            dedicated to delivering premium, patient-first clinical outcomes.
          </p>

          {/* Enhanced Search Input */}
          <div className="max-w-md mx-auto relative pt-4">
            <Search className="absolute left-4 top-1/2 translate-y-0.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search physicians by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all text-base shadow-xl border border-slate-200/20"
            />
          </div>
        </div>
      </section>

      {/* ── DOCTORS TEAM GRID ──────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/60 rounded-3xl p-6 text-center animate-pulse space-y-4"
              >
                <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto" />
                <div className="h-5 bg-slate-200 rounded-lg w-2/3 mx-auto" />
                <div className="h-4 bg-slate-200 rounded-md w-1/2 mx-auto" />
                <div className="h-4 bg-slate-100 rounded-md w-3/4 mx-auto" />
                <div className="h-10 bg-slate-200 rounded-xl w-full pt-4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200/60 rounded-3xl shadow-sm p-8 max-w-md mx-auto">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-4 stroke-[1.5]" />
            <p className="text-slate-500 font-medium text-lg">
              No doctors found matching your search.
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-emerald-600 text-sm font-semibold hover:underline"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((doctor, index) => (
              <div
                key={doctor.id}
                className="bg-white border border-slate-200/60 hover:border-slate-300/80 rounded-3xl p-6 text-center group transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  {/* Fluid Gradient Avatars */}
                  <div
                    className={`w-24 h-24 bg-gradient-to-br ${avatarGradients[index % avatarGradients.length]} rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-3xl shadow-inner group-hover:scale-[1.03] transition-transform duration-300`}
                  >
                    {doctor.firstName?.[0] || "D"}
                    {doctor.lastName?.[0] || "R"}
                  </div>

                  {/* Micro Ratings Row */}
                  <div className="flex items-center justify-center gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg mb-1 tracking-tight group-hover:text-emerald-700 transition-colors">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h3>

                  <p className="text-emerald-600 font-semibold text-sm tracking-wide uppercase text-[11px] mb-1">
                    {positionLabels[doctor.position] || doctor.position}
                  </p>

                  {doctor.department && (
                    <p className="text-slate-400 text-xs font-medium px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg inline-block mb-4">
                      {doctor.department.name}
                    </p>
                  )}
                </div>

                <Link
                  href={`/appointments?doctorId=${doctor.id}`}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 px-4 rounded-xl flex items-center gap-2 justify-center transition-all mt-4 group-hover:bg-emerald-600 group-hover:shadow-lg group-hover:shadow-emerald-600/10"
                >
                  <Calendar className="w-4 h-4" />
                  Book Consultation
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── CONTEXTUAL ROUTING FOOTER ───────────────────────── */}
      <section className="py-20 bg-slate-100 border-t border-slate-200/60 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Need Immediate Assistance?
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
            Contact our central processing desk directly, and our clinical
            coordinator will instantly route you to the correct specialist unit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm sm:max-w-none mx-auto pt-2">
            <Link
              href="/appointments"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-3.5 rounded-xl text-center shadow-md transition-all"
            >
              General Clinical Desk
            </Link>
            <Link
              href="/contact"
              className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm px-6 py-3.5 rounded-xl border border-slate-200 text-center shadow-sm transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
