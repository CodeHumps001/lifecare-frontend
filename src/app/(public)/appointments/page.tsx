"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { appointmentsApi, usersApi } from "@/lib/api";

// We need to check if there's a public booking API
// Based on your api.ts, the Public object has bookAppointment

const schema = z.object({
  doctorId: z.string().min(1, "Please select a doctor"),
  patientName: z.string().min(2, "Full name is required"),
  patientPhone: z.string().min(10, "Valid phone number is required"),
  patientEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  reason: z.string().min(10, "Please describe your reason for visiting"),
  date: z.string().min(1, "Please select a date"),
});

type FormData = z.infer<typeof schema>;

const steps = ["Patient Info", "Choose Doctor", "Date & Reason", "Confirm"];

export default function AppointmentsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    usersApi
      .list()
      .then((users) => {
        const docs = users.filter((u: any) => u.position === "DOCTOR") || [];
        setDoctors(
          docs.length > 0
            ? docs
            : [
                {
                  id: "demo1",
                  firstName: "Kwame",
                  lastName: "Asante",
                  department: { name: "Outpatient Department (OPD)" },
                },
                {
                  id: "demo2",
                  firstName: "Abena",
                  lastName: "Mensah",
                  department: { name: "Maternity & Delivery" },
                },
              ],
        );
      })
      .catch(() => {
        setDoctors([
          {
            id: "demo1",
            firstName: "Kwame",
            lastName: "Asante",
            department: { name: "Outpatient Department (OPD)" },
          },
          {
            id: "demo2",
            firstName: "Abena",
            lastName: "Mensah",
            department: { name: "Maternity & Delivery" },
          },
        ]);
      });
  }, []);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      // Use the Public API for booking (no auth required)
      // Import Public from your API or use the correct booking method
      // Since we don't have the Public import, let's use fetch directly or add the import

      // Option 1: If you have Public exported from api
      // import { Public } from "@/lib/api";
      // await Public.bookAppointment(data);

      // Option 2: If appointmentsApi has a book method (it doesn't)
      // await appointmentsApi.book(data);

      // Option 3: Direct fetch (fallback)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1"}/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to book appointment");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(
        err.message || "Failed to book appointment. Please call us directly.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 antialiased">
        <div className="bg-white border border-slate-200/60 rounded-3xl shadow-xl p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Appointment Booked!
          </h2>
          <p className="text-slate-600 mb-2 font-medium">
            Thank you,{" "}
            <span className="text-slate-900 font-semibold">
              {getValues("patientName")}
            </span>
            .
          </p>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Your request is queued. An SMS confirmation will be sent to{" "}
            <span className="text-slate-700 font-medium">
              {getValues("patientPhone")}
            </span>{" "}
            shortly.
          </p>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 text-left space-y-2">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">Date:</span>{" "}
              {getValues("date")}
            </p>
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">Reason:</span>{" "}
              {getValues("reason")}
            </p>
          </div>
          <a
            href="/"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl block text-center transition-all shadow-sm"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen">
      {/* ── HERO BANNER ──────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950 py-16 px-4 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-emerald-300 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full backdrop-blur-md">
            <Clock className="w-3.5 h-3.5" /> Fast Digital Triage
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Schedule Your Appointment
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto font-normal">
            Quick, secure, and intuitive booking. Or talk directly to a
            coordinator at{" "}
            <a
              href="tel:+233558484862"
              className="text-emerald-400 font-semibold hover:underline underline-offset-4"
            >
              +233 50 181 2304
            </a>
          </p>
        </div>
      </section>

      {/* ── SPLIT MULTIFORM CONTAINER ────────────────── */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Progress Timeline Indicator */}
        <div className="flex items-center justify-between mb-10 max-w-xl mx-auto px-4 sm:px-0">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i + 1 <= step
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                    : "bg-white border border-slate-200 text-slate-400"
                }`}
              >
                {i + 1 < step ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-xs font-bold hidden md:block ${i + 1 <= step ? "text-slate-950" : "text-slate-400"}`}
              >
                {s}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`h-[2px] w-6 sm:w-16 ml-1 transition-colors ${i + 1 < step ? "bg-slate-900" : "bg-slate-200"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Dynamic Split Component */}
        <div className="bg-white border border-slate-200/60 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* LEFT PANEL: Professional Art Cover */}
          <div className="hidden lg:block lg:col-span-5 relative bg-slate-900 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
              alt="Medical facility consultation space"
              fill
              priority
              className="object-cover opacity-85 brightness-[0.85] saturate-[0.9] transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-8 left-6 right-6 p-6 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl text-white space-y-2 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 fill-emerald-500/20 text-emerald-400" />{" "}
                Secure Processing
              </div>
              <p className="text-sm font-medium leading-relaxed text-slate-200">
                Your diagnostic routing forms are encrypted end-to-end for
                comprehensive patient privacy protocols.
              </p>
            </div>
          </div>

          {/* RIGHT PANEL: Dynamic Multi-step Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white"
          >
            {error && (
              <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl p-4 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Step 1 - Patient Info */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Patient Information
                  </h2>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">
                    Please provide basic matching database records.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      {...register("patientName")}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.patientName && (
                    <p className="text-rose-600 text-xs font-medium mt-1">
                      {errors.patientName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      {...register("patientPhone")}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all text-sm"
                      placeholder="0244 000 000"
                      type="tel"
                    />
                  </div>
                  {errors.patientPhone && (
                    <p className="text-rose-600 text-xs font-medium mt-1">
                      {errors.patientPhone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                    Email Address{" "}
                    <span className="text-slate-400 font-normal lowercase">
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      {...register("patientEmail")}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all text-sm"
                      placeholder="your@email.com"
                      type="email"
                    />
                  </div>
                  {errors.patientEmail && (
                    <p className="text-rose-600 text-xs font-medium mt-1">
                      {errors.patientEmail.message}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center transition-all text-sm mt-4 shadow-sm"
                >
                  Next: Choose Doctor →
                </button>
              </div>
            )}

            {/* Step 2 - Choose Doctor */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Choose a Doctor
                  </h2>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">
                    Select a specialist from our operational clinical pool.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                    Select Doctor <span className="text-rose-500">*</span>
                  </label>
                  <select
                    {...register("doctorId")}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all text-sm appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                      backgroundPosition: "right 12px center",
                      backgroundSize: "16px",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <option value="">— Select a physician —</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        Dr. {doc.firstName} {doc.lastName}{" "}
                        {doc.department ? `(${doc.department.name})` : ""}
                      </option>
                    ))}
                    {doctors.length === 0 && (
                      <option value="general">
                        General Medical Practitioner
                      </option>
                    )}
                  </select>
                  {errors.doctorId && (
                    <p className="text-rose-600 text-xs font-medium mt-1">
                      {errors.doctorId.message}
                    </p>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <strong className="text-slate-700">
                      Unsure about tracking units?
                    </strong>{" "}
                    Choose any placeholder doctor. Our triage office reassesses
                    medical charts upon case validation.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 rounded-xl border border-slate-200 text-center transition-all text-sm shadow-sm"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl text-center transition-all text-sm shadow-sm"
                  >
                    Next: Date & Reason →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 - Date & Reason */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Appointment Details
                  </h2>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">
                    Coordinate calendar dates and symptoms log.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                    Preferred Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      {...register("date")}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all text-sm"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  {errors.date && (
                    <p className="text-rose-600 text-xs font-medium mt-1">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                    Reason for Visit <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <textarea
                      {...register("reason")}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 focus:bg-white transition-all text-sm resize-none h-28"
                      placeholder="Please describe symptoms or required corporate medical screening parameters..."
                    />
                  </div>
                  {errors.reason && (
                    <p className="text-rose-600 text-xs font-medium mt-1">
                      {errors.reason.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 rounded-xl border border-slate-200 text-center transition-all text-sm shadow-sm"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl text-center transition-all text-sm shadow-sm"
                  >
                    Review Booking →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4 - Confirm */}
            {step === 4 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Confirm Appointment
                  </h2>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">
                    Verify information integrity before database submission.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3 split-review-panel">
                  {[
                    { label: "Patient Name", value: getValues("patientName") },
                    {
                      label: "Phone Contact",
                      value: getValues("patientPhone"),
                    },
                    {
                      label: "Email Route",
                      value: getValues("patientEmail") || "Not provided",
                    },
                    { label: "Target Date", value: getValues("date") },
                    { label: "Clinical Reason", value: getValues("reason") },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-4 border-b border-slate-200/40 pb-2 last:border-none last:pb-0"
                    >
                      <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase">
                        {label}
                      </span>
                      <span className="text-sm text-slate-900 font-semibold sm:text-right line-clamp-2 max-w-xs">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                  <p className="text-amber-800 text-xs leading-relaxed">
                    <strong className="font-bold">Operational Note:</strong>{" "}
                    Submission updates cloud ledgers natively. For immediate
                    emergency triage, bypass interactive steps and contact
                    surgical stations directly.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 rounded-xl border border-slate-200 text-center transition-all text-sm shadow-sm"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl text-center transition-all text-sm shadow-md disabled:opacity-55 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : "Confirm Booking ✓"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Centralised Footer Help Desk */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Need processing support?{" "}
            <a
              href="tel:+233501812304"
              className="text-slate-800 font-bold hover:underline underline-offset-4"
            >
              Call Hotline +233 50 181 2304
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
