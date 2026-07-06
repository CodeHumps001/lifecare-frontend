"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Calendar,
  Star,
  Stethoscope,
  Sparkles,
  Award,
  MapPin,
  Clock,
  ChevronRight,
  Phone,
} from "lucide-react";
import { usersAPI } from "@/lib/api";

// Type definitions matching your Prisma schema
interface StaffProfile {
  id: string;
  userId: string;
  phone?: string;
  photoUrl?: string;
  bio?: string;
}

interface Department {
  id: string;
  name: string;
}

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  position: string;
  departmentId: string | null;
  isActive: boolean;
  createdAt: string;
  profile: StaffProfile | null;
  department: Department | null;
}

const positionLabels: Record<string, string> = {
  DOCTOR: "Medical Doctor",
  NURSE: "Registered Nurse",
  MIDWIFE: "Certified Midwife",
  PHARMACIST: "Pharmacist",
  LAB_TECHNICIAN: "Lab Technician",
};

// Fluid gradients for dynamic initial avatars
const avatarGradients = [
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-fuchsia-600",
  "from-teal-500 to-cyan-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-slate-700 to-slate-900",
];

// Specialization mapping based on department
const departmentSpecializations: Record<
  string,
  { specialization: string; experience: string }
> = {
  "Outpatient Department (OPD)": {
    specialization: "General Medicine",
    experience: "15+ years",
  },
  "Maternity & Delivery": {
    specialization: "Obstetrics & Gynecology",
    experience: "12+ years",
  },
  "Surgical Services": {
    specialization: "General Surgery",
    experience: "18+ years",
  },
  "Eye Clinic": { specialization: "Ophthalmology", experience: "10+ years" },
  Laboratory: { specialization: "Clinical Pathology", experience: "8+ years" },
  Pharmacy: { specialization: "Clinical Pharmacy", experience: "7+ years" },
  Records: { specialization: "Medical Records", experience: "5+ years" },
};

const fallbackDoctors: Doctor[] = [
  {
    id: "1",
    firstName: "Kwame",
    lastName: "Asante",
    email: "kwame@divinenetcare.com",
    role: "DOCTOR",
    position: "DOCTOR",
    departmentId: "1",
    isActive: true,
    createdAt: "2024-01-01",
    profile: {
      id: "p1",
      userId: "1",
      phone: "+233 55 123 4567",
      photoUrl: "",
      bio: "Experienced general practitioner with over 15 years of clinical experience in outpatient care and preventive medicine.",
    },
    department: { id: "1", name: "Outpatient Department (OPD)" },
  },
  {
    id: "2",
    firstName: "Abena",
    lastName: "Mensah",
    email: "abena@divinenetcare.com",
    role: "DOCTOR",
    position: "DOCTOR",
    departmentId: "2",
    isActive: true,
    createdAt: "2024-01-01",
    profile: {
      id: "p2",
      userId: "2",
      phone: "+233 55 234 5678",
      photoUrl: "",
      bio: "Specialist in maternal care and delivery with a passion for women's health and prenatal care.",
    },
    department: { id: "2", name: "Maternity & Delivery" },
  },
  {
    id: "3",
    firstName: "Kofi",
    lastName: "Boateng",
    email: "kofi@divinenetcare.com",
    role: "DOCTOR",
    position: "DOCTOR",
    departmentId: "3",
    isActive: true,
    createdAt: "2024-01-01",
    profile: {
      id: "p3",
      userId: "3",
      phone: "+233 55 345 6789",
      photoUrl: "",
      bio: "Skilled surgeon specializing in minimally invasive procedures and post-operative care.",
    },
    department: { id: "3", name: "Surgical Services" },
  },
  {
    id: "4",
    firstName: "Ama",
    lastName: "Owusu",
    email: "ama@divinenetcare.com",
    role: "DOCTOR",
    position: "DOCTOR",
    departmentId: "4",
    isActive: true,
    createdAt: "2024-01-01",
    profile: {
      id: "p4",
      userId: "4",
      phone: "+233 55 456 7890",
      photoUrl: "",
      bio: "Dedicated ophthalmologist providing comprehensive eye care services and vision correction treatments.",
    },
    department: { id: "4", name: "Eye Clinic" },
  },
];

// Helper function to get department-based specialization info
const getDoctorSpecialization = (doctor: Doctor) => {
  if (
    doctor.department?.name &&
    departmentSpecializations[doctor.department.name]
  ) {
    return departmentSpecializations[doctor.department.name];
  }
  return { specialization: "Medical Professional", experience: "Experienced" };
};

// Helper function to generate star rating based on doctor id (for demo)
const getDoctorRating = (doctorId: string) => {
  const ratings = ["4.8", "4.9", "4.7", "4.6", "5.0", "4.8", "4.9"];
  const index = doctorId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ratings[index % ratings.length];
};

// Helper function to get available slots (for demo)
const getAvailableSlots = (doctorId: string) => {
  const slots = [3, 2, 5, 1, 4, 3, 2];
  const index = doctorId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return slots[index % slots.length];
};

// Avatar Component
const DoctorAvatar = ({ doctor, index }: { doctor: Doctor; index: number }) => {
  const photoUrl = doctor.profile?.photoUrl;
  const initials = `${doctor.firstName?.[0] || "D"}${doctor.lastName?.[0] || "R"}`;
  const gradient = avatarGradients[index % avatarGradients.length];

  if (photoUrl && photoUrl.trim() !== "") {
    return (
      <div className="relative w-28 h-28 mx-auto mb-4">
        <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-white shadow-lg">
          <Image
            src={photoUrl}
            alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 112px"
          />
        </div>
        {/* Online/Active indicator */}
        {doctor.isActive && (
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
        )}
      </div>
    );
  }

  return (
    <div
      className={`w-28 h-28 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-3xl shadow-lg ring-4 ring-white transition-transform duration-300 group-hover:scale-105`}
    >
      {initials}
    </div>
  );
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    usersAPI
      .getAll()
      .then((res) => {
        const docs =
          res?.data?.data?.filter((u: any) => u.position === "DOCTOR") || [];
        // Map the API response to include profile data properly
        const mappedDoctors = docs.map((doc: any) => ({
          ...doc,
          profile: doc.profile || null,
          department: doc.department || null,
        }));
        setDoctors(mappedDoctors.length > 0 ? mappedDoctors : fallbackDoctors);
      })
      .catch((err) => {
        console.warn(
          "Public Fetch redirected or blocked by auth session. rendering fallbacks.",
          err,
        );
        setDoctors(fallbackDoctors);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = doctors.filter((d) => {
    const searchTerm = search.toLowerCase();
    const specialization =
      getDoctorSpecialization(d).specialization.toLowerCase();
    return `${d.firstName} ${d.lastName} ${specialization} ${d.department?.name || ""} ${d.profile?.bio || ""}`
      .toLowerCase()
      .includes(searchTerm);
  });

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen">
      {/* ── MODERN COMBINED HERO ──────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950 py-24 px-4 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
        <div className="absolute -top-40 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, specialty, or department..."
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
                <div className="w-28 h-28 bg-slate-200 rounded-full mx-auto" />
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
            {filtered.map((doctor, index) => {
              const { specialization, experience } =
                getDoctorSpecialization(doctor);
              const rating = getDoctorRating(doctor.id);
              const availableSlots = getAvailableSlots(doctor.id);

              return (
                <div
                  key={doctor.id}
                  className="group relative bg-white border border-slate-200/60 hover:border-emerald-200 rounded-3xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Top gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 transform origin-left transition-transform duration-300 group-hover:scale-x-100 scale-x-0" />

                  <div className="p-6 flex flex-col h-full">
                    {/* Doctor Avatar with status indicator */}
                    <DoctorAvatar doctor={doctor} index={index} />

                    {/* Doctor Info */}
                    <div className="text-center space-y-2 flex-grow">
                      <h3 className="font-bold text-slate-900 text-lg tracking-tight group-hover:text-emerald-700 transition-colors">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h3>

                      <p className="text-emerald-600 font-semibold text-xs tracking-wide uppercase">
                        {positionLabels[doctor.position] || doctor.position}
                      </p>

                      {/* Specialization Badge */}
                      <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
                        {specialization}
                      </span>

                      {/* Department */}
                      {doctor.department && (
                        <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{doctor.department.name}</span>
                        </div>
                      )}

                      {/* Bio excerpt */}
                      {doctor.profile?.bio && (
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mt-2">
                          {doctor.profile.bio}
                        </p>
                      )}
                    </div>

                    {/* Quick Stats Bar */}
                    <div className="flex items-center justify-center gap-4 my-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-slate-700">
                          {rating}
                        </span>
                      </div>
                      <div className="w-px h-4 bg-slate-200" />
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className="text-xs text-slate-500">
                          {experience}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Link
                        href={`/appointments?doctorId=${doctor.id}`}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm py-3 px-4 rounded-xl flex items-center gap-2 justify-center transition-all shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/20"
                      >
                        <Calendar className="w-4 h-4" />
                        Book Consultation
                        <span className="ml-auto flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">
                            {availableSlots} slots
                          </span>
                        </span>
                      </Link>

                      <Link
                        href={`/doctors/${doctor.id}`}
                        className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm py-2.5 px-4 rounded-xl flex items-center gap-1.5 justify-center transition-all border border-slate-200"
                      >
                        View Full Profile
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
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
