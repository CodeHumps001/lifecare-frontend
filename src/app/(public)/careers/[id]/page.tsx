"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  FileText,
  Link2,
  CheckCircle,
  AlertCircle,
  Briefcase,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { jobsAPI } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  cvUrl: z
    .string()
    .url("Please enter a valid URL to your CV (Google Drive, Dropbox, etc.)"),
  coverLetter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters")
    .optional()
    .or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export default function JobApplicationPage({
  params,
}: {
  params: { id: string };
}) {
  const [job, setJob] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    jobsAPI
      .getAll()
      .then((res) => {
        const found = res?.data?.data?.find((j: any) => j.id === params.id);
        setJob(
          found || {
            id: params.id,
            title: "Staff Nurse",
            department: "Maternity",
            type: "FULL_TIME",
            description:
              "Join our maternity team and deliver elite medical solutions.",
          },
        );
      })
      .catch(() =>
        setJob({
          id: params.id,
          title: "Staff Nurse",
          department: "Maternity",
          type: "FULL_TIME",
          description:
            "Join our maternity team and deliver elite medical solutions.",
        }),
      );
  }, [params.id]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      await jobsAPI.apply(params.id, data);
      setSubmitted(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to submit application. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16 antialiased">
        <div className="bg-white rounded-3xl border border-slate-200/60 p-10 max-w-md w-full text-center shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-600" />
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-inner animate-bounce">
            <CheckCircle className="w-8 h-8 stroke-[1.75]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              Application Transmitted!
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-normal">
              Thank you for applying for the{" "}
              <strong className="text-slate-900 font-bold">{job?.title}</strong>{" "}
              position at Divine Netcare Hospital. Our clinical talent division
              will review your profile credentials and follow up via email.
            </p>
          </div>
          <Link
            href="/careers"
            className="w-full text-center inline-flex items-center justify-center bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs tracking-wider uppercase px-5 py-3.5 rounded-xl shadow-sm transition-colors"
          >
            Return to Career Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen pb-24">
      {/* ── HEADER CONTEXT ──────────────────────────────── */}
      <header className="bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950 py-16 px-4 border-b border-slate-900 relative overflow-hidden">
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold tracking-wider uppercase transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />{" "}
            Back to Vacancies
          </Link>
          <div className="space-y-2">
            <span className="inline-flex items-center bg-emerald-500/10 text-emerald-300 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded border border-emerald-500/20">
              Interactive Intake Form
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {job?.title || "Specialist Intake"}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-semibold uppercase tracking-wider flex flex-wrap gap-x-3 items-center">
              <span>{job?.department} Unit</span>
              <span className="text-slate-600">•</span>
              <span>Kumasi, GH</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">
                {job?.type?.replace("_", " ")}
              </span>
            </p>
          </div>
        </div>
      </header>

      {/* ── LAYOUT GRID CORE ────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Intake Block */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div className="border-b border-slate-100 pb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h2 className="text-lg font-extrabold text-slate-950 tracking-tight">
                  Candidate Profile
                </h2>
              </div>

              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-800 rounded-xl p-4">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {error}
                  </p>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    {...register("name")}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                    placeholder="Enter full legal name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-600 text-xs font-semibold">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                    placeholder="name@institution.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-xs font-semibold">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    {...register("phone")}
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                    placeholder="e.g., 0244 000 000"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-xs font-semibold">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* CV Repository Link */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                  CV / Portfolio Link <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    {...register("cvUrl")}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                    placeholder="https://drive.google.com/..."
                  />
                </div>
                {errors.cvUrl && (
                  <p className="text-red-600 text-xs font-semibold">
                    {errors.cvUrl.message}
                  </p>
                )}
                <p className="text-slate-400 text-[11px] leading-relaxed font-normal">
                  Host your CV securely on Google Drive, Dropbox, or OneDrive
                  and supply the accessible URL parameters.
                </p>
              </div>

              {/* Cover Letter */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Cover Letter{" "}
                  <span className="text-slate-400 font-normal lowercase">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <textarea
                    {...register("coverLetter")}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all h-32 resize-none"
                    placeholder="Outline your specialized qualifications and core motivations..."
                  />
                </div>
                {errors.coverLetter && (
                  <p className="text-red-600 text-xs font-semibold">
                    {errors.coverLetter.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-950 text-white hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed font-bold text-xs tracking-wider uppercase py-4 rounded-xl shadow-sm transition-colors"
              >
                {loading ? "Transmitting Profile..." : "Submit Profile Matrix"}
              </button>
            </form>
          </div>

          {/* Sidebar Context */}
          <aside className="lg:col-span-5 space-y-6">
            {job && (
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Summary Sheet
                  </h3>
                </div>
                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-baseline justify-between">
                    <span className="text-slate-400 font-normal">Unit:</span>{" "}
                    <span className="font-bold text-slate-900 text-right">
                      {job.department}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-slate-400 font-normal">
                      Parameters:
                    </span>{" "}
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-right uppercase text-[10px] tracking-wide">
                      {job.type?.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-slate-400 font-normal">Region:</span>{" "}
                    <span className="font-bold text-slate-900 text-right">
                      Kumasi, Ashanti
                    </span>
                  </div>
                </div>
                {job.description && (
                  <p className="text-slate-500 text-xs leading-relaxed border-t border-slate-100 pt-3 font-normal">
                    {job.description}
                  </p>
                )}
              </div>
            )}

            <div className="bg-slate-900/5 border border-slate-200/60 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-slate-900">
                <HelpCircle className="w-4 h-4 stroke-[2]" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Clinical Support
                </h3>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed font-normal">
                Facing technical blockades or token credential failures while
                routing your data? Message our operations wing directly.
              </p>
              <a
                href="mailto:andrewdarkwah123@gmail.com"
                className="block text-emerald-700 font-bold text-xs hover:underline pt-1"
              >
                andrewdarkwah123@gmail.com
              </a>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
