"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  ShieldCheck,
  AlertCircle,
  Instagram,
  Facebook,
  Linkedin,
  ArrowUpRight,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }>();

  const onSubmit = async (data: any) => {
    setSubmitError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to send message");
      }

      setSubmitted(true);
      reset();
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Hotline Desk",
      lines: ["+233 50 181 2304"],
      action: { href: "tel:+233501812304", label: "Call Emergency Line" },
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      icon: Mail,
      title: "Digital Inquiries",
      lines: ["divinenetcarehsp@gmail.com"],
      action: {
        href: "mailto:divinenetcarehsp@gmail.com",
        label: "Open Mailer",
      },
      badgeColor: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      icon: MapPin,
      title: "Hospital Location",
      lines: ["Kronum-Abouhia, Kumasi", "Afigya Kwabre South, Ashanti Region"],
      action: {
        href: "https://maps.app.goo.gl/wd5U7mHUN3RW14US6",
        label: "Open Google Maps",
      },
      badgeColor: "bg-teal-50 text-teal-700 border-teal-100",
    },
    {
      icon: Clock,
      title: "Consultation Windows",
      lines: [
        "Morning: 5:30AM – 7:00AM",
        "Afternoon: 12:00PM – 1:00PM",
        "Emergency: 24/7 Intake",
      ],
      badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
    },
  ];

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen pb-24">
      {/* ── HIGH-END REDESIGNED HERO BLOCK WITH VERIFIED HEALTHCARE HERO IMAGE ── */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none z-10">
          <div className="w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-4 py-20 relative z-20">
          {/* Left Text Presentation */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-md border border-emerald-500/20 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified
              Medical Facility Center
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none">
              Reach the Divine <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-emerald-400">
                Netcare Clinical Desk
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Connect directly with our primary dynamic care departments,
              arrange inpatient appointments, or forward institutional paperwork
              to our administrative units.
            </p>
          </div>

          {/* Right Hero Image Module */}
          <div className="lg:col-span-5 relative w-full h-[320px] lg:h-[380px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 group">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-60" />
            <Image
              src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80"
              alt="Divine Netcare Hospital Diagnostic Equipment Integration"
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-6 left-6 right-6 z-20 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl">
              <p className="text-white text-xs font-bold uppercase tracking-wider">
                Kronum-Abuohia
              </p>
              <p className="text-slate-400 text-[11px] font-normal mt-0.5">
                Comprehensive, certified local healthcare infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUAD DATA CARDS GRID ────────────────────────── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, idx) => {
            const IconComponent = info.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${info.badgeColor}`}
                  >
                    <IconComponent className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h3 className="font-extrabold text-slate-950 text-base tracking-tight">
                    {info.title}
                  </h3>
                  <div className="space-y-1">
                    {info.lines.map((line, i) => (
                      <p
                        key={i}
                        className="text-slate-500 text-xs sm:text-sm font-normal leading-relaxed"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
                {info.action && (
                  <a
                    href={info.action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 text-xs font-bold tracking-wide uppercase inline-flex items-center gap-1 group pt-2 border-t border-slate-50"
                  >
                    {info.action.label}
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* ── SECURE INPUT MODULE + PRECISE EMBEDDED GEOLOCATION ──── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form Processing Subsystem */}
          <div className="lg:col-span-7">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight mb-6">
              Send A Secure Message
            </h2>

            {submitted ? (
              <div className="bg-white border border-slate-200/60 rounded-3xl p-10 text-center shadow-sm space-y-6 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-600" />
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-inner animate-bounce">
                  <CheckCircle className="w-8 h-8 stroke-[1.75]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight">
                    Transmission Verified
                  </h3>
                  <p className="text-slate-500 text-sm font-normal max-w-sm mx-auto leading-relaxed">
                    Your message packet has been routed successfully. The
                    administrative clinic matrix will reply to your registered
                    email vector shortly.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center justify-center bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs tracking-wider uppercase px-5 py-3.5 rounded-xl shadow-sm transition-colors"
                >
                  Reset Form Stream
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("name", { required: true })}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-xs font-semibold">
                        Parameter Required
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                      Phone Connection
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                      placeholder="e.g., +233 50 181 2304"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("email", { required: true })}
                    type="email"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                    placeholder="name@domain.com"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs font-semibold">
                      Parameter Required
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                    Subject Matrix <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("subject", { required: true })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                    placeholder="Inquiry focus context"
                  />
                  {errors.subject && (
                    <p className="text-red-600 text-xs font-semibold">
                      Parameter Required
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                    Message Body <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register("message", { required: true })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all resize-none h-32"
                    placeholder="Explain your operational medical requests..."
                  />
                  {errors.message && (
                    <p className="text-red-600 text-xs font-semibold">
                      Parameter Required
                    </p>
                  )}
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-xl px-4 py-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-950 text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed font-bold text-xs tracking-wider uppercase py-4 rounded-xl shadow-sm transition-colors flex items-center gap-2 justify-center"
                >
                  <Send className="w-3.5 h-3.5" />{" "}
                  {isSubmitting ? "Sending..." : "Dispatch Message Data"}
                </button>
              </form>
            )}
          </div>

          {/* Embedded Map System Components (Query String Fallback) */}
          <div className="lg:col-span-5 space-y-6">
            {/* SEARCH-QUERY BACKED MAP EMBED TO GUARANTEE PIN DROPS DIRECTLY ON DIVINE NETCARE */}
            <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm h-80 relative group">
              <iframe
                title="Divine Netcare Hospital Verified Location View"
                src="https://maps.google.com/maps?q=Divine%20Netcare%20Hospital,%20Kumasi,%20Ghana&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 object-cover"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200/60 p-3 rounded-xl flex items-center justify-between shadow-md pointer-events-none group-hover:bg-white transition-colors duration-300">
                <div className="space-y-0.5">
                  <p className="font-extrabold text-slate-950 text-xs tracking-tight">
                    Divine Netcare Hospital
                  </p>
                  <p className="text-slate-500 text-[11px] font-normal">
                    Afrancho-Buoho, Off Offinso Rd
                  </p>
                </div>
                <a
                  href="https://maps.app.goo.gl/wd5U7mHUN3RW14US6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-950 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg pointer-events-auto shadow-sm hover:bg-emerald-700 transition-colors"
                >
                  Get Route
                </a>
              </div>
            </div>

            {/* Premium Interactive Broadcast Hub */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Broadcast Feeds
              </h3>
              <div className="flex gap-3">
                {[
                  {
                    icon: Instagram,
                    label: "Instagram",
                    href: "https://instagram.com/divine_netcare_hospital",
                    color:
                      "hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200",
                  },
                  {
                    icon: Facebook,
                    label: "Facebook",
                    href: "#",
                    color:
                      "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200",
                  },
                  {
                    icon: Linkedin,
                    label: "LinkedIn",
                    href: "#",
                    color:
                      "hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200",
                  },
                ].map((social) => {
                  const SocialIcon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-11 h-11 bg-slate-50 text-slate-600 border border-slate-200/80 rounded-xl flex items-center justify-center transition-all shadow-inner ${social.color}`}
                    >
                      <SocialIcon className="w-4 h-4 stroke-[2]" />
                    </a>
                  );
                })}
              </div>
              <p className="text-slate-400 text-xs font-normal leading-relaxed">
                Review verified digital news channels regarding localized
                clinical interventions, immunization updates, and public
                services within the district.
              </p>
            </div>

            {/* Primary Trauma Call Interface */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 rounded-3xl p-6 text-white border border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-1.5 relative z-10">
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-widest">
                  <AlertCircle className="w-4 h-4" /> Priority Trauma Line
                </div>
                <h3 className="text-lg font-extrabold tracking-tight">
                  Immediate Medical Crisis?
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed font-normal">
                  Do not await form process replies during triage situations.
                  Open immediate telephone links to connect with active
                  emergency operators instantly.
                </p>
              </div>
              <a
                href="tel:+23341504824"
                className="flex items-center gap-2 bg-white text-slate-950 font-bold px-5 py-3.5 rounded-xl hover:bg-slate-50 transition-colors w-full justify-center text-xs tracking-wider uppercase shadow-md relative z-10"
              >
                <Phone className="w-4 h-4 text-emerald-600" /> Dial Urgent Care
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
