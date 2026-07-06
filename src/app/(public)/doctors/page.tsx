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
} from "lucide-react";
import { usersAPI } from "@/lib/api";

// --- Types & Config ---
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

const avatarGradients = [
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-fuchsia-600",
  "from-teal-500 to-cyan-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-slate-700 to-slate-900",
];

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

// --- Helper Functions ---
const getDoctorSpecialization = (doctor: Doctor) => {
  return (
    departmentSpecializations[doctor.department?.name || ""] || {
      specialization: "Professional",
      experience: "Experienced",
    }
  );
};

const getDoctorRating = (id: string) => {
  const ratings = ["4.8", "4.9", "4.7", "4.6", "5.0"];
  return ratings[id.length % ratings.length];
};

const getAvailableSlots = (id: string) => {
  const slots = [3, 2, 5, 1, 4];
  return slots[id.length % slots.length];
};

const DoctorAvatar = ({ doctor, index }: { doctor: Doctor; index: number }) => {
  const photoUrl = doctor.profile?.photoUrl;
  const initials = `${doctor.firstName?.[0] || "D"}${doctor.lastName?.[0] || "R"}`;
  const gradient = avatarGradients[index % avatarGradients.length];

  if (photoUrl) {
    return (
      <div className="relative w-20 h-20 mb-3 mx-auto">
        <Image
          src={photoUrl}
          alt={doctor.firstName}
          fill
          className="rounded-full object-cover border-4 border-white shadow-md"
        />
        {doctor.isActive && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
        )}
      </div>
    );
  }
  return (
    <div
      className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-2xl shadow-md`}
    >
      {initials}
    </div>
  );
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    usersAPI
      .getAll()
      .then((res) => {
        const docs =
          res?.data?.data?.filter((u: any) => u.position === "DOCTOR") || [];
        setDoctors(docs);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = doctors.filter((d) =>
    `${d.firstName} ${d.lastName} ${d.department?.name}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-slate-950 py-20 px-4 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4">Meet Our Specialists</h1>
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search by name or department..."
            className="w-full px-6 py-3 rounded-2xl bg-white/10 text-white placeholder-slate-400"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((doctor, index) => {
            const { specialization, experience } =
              getDoctorSpecialization(doctor);
            return (
              <div
                key={doctor.id}
                className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center"
              >
                <DoctorAvatar doctor={doctor} index={index} />
                <h3 className="font-bold text-slate-900">
                  {doctor.firstName} {doctor.lastName}
                </h3>
                <p className="text-emerald-600 text-[11px] font-bold uppercase">
                  {positionLabels[doctor.position]}
                </p>
                <div className="mt-3 flex gap-2 text-[10px] text-slate-500">
                  <span className="bg-slate-100 px-2 py-1 rounded">
                    {specialization}
                  </span>
                  <span className="px-2 py-1">{experience}</span>
                </div>
                <Link
                  href={`/appointments?doctorId=${doctor.id}`}
                  className="mt-6 w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book Consultation
                </Link>
                <Link
                  href={`/doctors/${doctor.id}`}
                  className="mt-2 text-slate-400 text-[11px] hover:text-emerald-600"
                >
                  View Profile
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
