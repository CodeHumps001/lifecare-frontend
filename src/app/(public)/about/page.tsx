import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  Heart,
  Shield,
  Users,
  Award,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Divine Netcare Hospital — our mission, values, and commitment to quality healthcare in Kumasi, Ghana.",
};

const values = [
  {
    icon: Heart,
    title: "Compassion",
    description:
      "We treat every patient with warmth, empathy, and the dignity they deserve.",
  },
  {
    icon: Shield,
    title: "Integrity",
    description:
      "We uphold the highest ethical standards in all our medical practices.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We continuously improve our services to deliver the best possible outcomes.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We are committed to the health and wellbeing of the Kumasi community.",
  },
];

const milestones = [
  { year: "2014", event: "Divine Netcare Hospital founded in Kumasi" },
  {
    year: "2016",
    event: "Expanded maternity ward — becoming known as the best in Kumasi",
  },
  {
    year: "2018",
    event: "Launched state-of-the-art laboratory and scan centre",
  },
  {
    year: "2020",
    event: "Opened eye clinic providing specialist optical care",
  },
  {
    year: "2022",
    event: "Introduced NFC mobile payments for patient convenience",
  },
  { year: "2024", event: "Launched LifeCare digital health management system" },
];

export default function AboutPage() {
  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen">
      {/* ── HIGH-END HERO HEADER MODULE ────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950 overflow-hidden border-b border-slate-900 px-4 py-24 text-center">
        <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&h=400&fit=crop"
            alt=""
            fill
            className="object-cover filter grayscale contrast-125"
            priority
          />
        </div>

        <div className="max-w-4xl mx-auto space-y-6 relative z-20">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-md border border-emerald-500/20 backdrop-blur-md">
            <Users className="w-3.5 h-3.5 text-emerald-400" /> Institution
            Overview
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none">
            Caring for Kumasi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-emerald-400">
              Since 2014
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed pt-2">
            Divine Netcare Hospital was founded with one mission: to make
            quality healthcare accessible to every family in Kumasi and the
            wider Ashanti Region.
          </p>
        </div>
      </section>

      {/* ── CORE STORY SECTION ─────────────────────────────────── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Asymmetric Image Frame */}
          <div className="relative p-2">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-white p-2">
              <Image
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=700&h=500&fit=crop"
                alt="Divine Netcare medical team"
                width={700}
                height={500}
                className="w-full object-cover rounded-2xl"
              />
            </div>
            {/* Absolute Google Rating Card */}
            <div className="absolute -bottom-6 -left-2 bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-xl max-w-[200px] text-center space-y-1 transform hover:scale-105 transition-transform duration-300">
              <div className="font-extrabold text-3xl text-emerald-400 tracking-tight">
                4.4 ★
              </div>
              <div className="text-slate-400 text-xs font-medium leading-normal">
                Verified Google Rating from our local community
              </div>
            </div>
          </div>

          {/* Text Framework */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-emerald-700 font-bold text-xs tracking-wider uppercase block">
                Our Historical Genesis
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                A Hospital Built on Love and Clinical Service
              </h2>
            </div>
            <div className="text-slate-600 text-sm sm:text-base space-y-4 font-normal leading-relaxed">
              <p>
                Divine Netcare Hospital was established to address the expanding
                operational healthcare needs of Kumasi's growing population.
                Located at Kronum-Abouhia, we have systematically scaled from a
                targeted community clinic into a comprehensive, multi-specialty
                hospital asset serving thousands.
              </p>
              <p>
                Our name reflects our foundational perspective — that rendering
                medical aid to the sick is a divine calling. Every clinical
                practitioner, technician, and administrative staff member shares
                this distinct commitment and embodies it across active
                operations daily.
              </p>
              <p className="italic font-medium text-slate-850 border-l-2 border-emerald-500 pl-4 bg-slate-100/50 py-2 rounded-r-xl">
                We are particularly honored by our maternity unit, which
                patients and independent community matrixes have consistently
                validated as the premier choice in Kumasi. Bringing new life
                safely into the world is an elite privilege we treat with
                absolute severity.
              </p>
            </div>

            {/* Structural Stat Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="font-extrabold text-3xl text-slate-950 mb-0.5 tracking-tight">
                  10+
                </div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wide">
                  Years of Service
                </div>
              </div>
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="font-extrabold text-3xl text-slate-950 mb-0.5 tracking-tight">
                  1,000+
                </div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wide">
                  Daily Patients Served
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION MATRIX ────────────────────────────── */}
      <section className="py-16 bg-slate-100 border-y border-slate-200/60 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission Card */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow space-y-5">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
              <Heart className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-950 tracking-tight">
                Our Mission Architecture
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed font-normal">
                To provide accessible, compassionate, and uncompromisingly
                high-quality healthcare services to every individual and family
                within the region, framing each therapeutic path with structured
                dignity, respect, and elite medical capability.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-900 rounded-3xl p-8 text-white shadow-xl space-y-5 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="w-12 h-12 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center text-emerald-400 backdrop-blur-sm">
              <Award className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Our Vision Spectrum
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed font-normal">
                To remain the most trusted and structurally sound healthcare
                institution in the Ashanti Region—universally recognized for
                clinical precision, technical innovation, customercentric
                frameworks, and a permanent positive footprint on public health
                execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUE PIPELINES ───────────────────────────────── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-14">
          <span className="text-emerald-700 font-bold text-xs tracking-wider uppercase block">
            Operational Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            The Core Values Driving Our Care
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center space-y-4"
            >
              <div className="w-12 h-12 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                <value.icon className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-slate-950 tracking-tight">
                  {value.title}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm font-normal leading-relaxed">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CHRONOLOGICAL JOURNEY TIMELINE ──────────────────────── */}
      <section className="py-20 bg-slate-100 border-t border-slate-200/60 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-16">
            <span className="text-emerald-700 font-bold text-xs tracking-wider uppercase block">
              Evolutionary Path
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Milestones That Define Our Leadership
            </h2>
          </div>

          <div className="relative">
            {/* Center-Left Timeline Vector Line */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-slate-300/80" />

            <div className="space-y-8">
              {milestones.map((milestone) => (
                <div
                  key={milestone.year}
                  className="flex gap-4 sm:gap-6 items-start relative group"
                >
                  {/* Floating Metric Marker */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-950 text-white border border-slate-800 rounded-xl flex items-center justify-center font-extrabold text-xs sm:text-sm tracking-tight shrink-0 shadow-lg relative z-10 transition-colors group-hover:bg-emerald-950 group-hover:border-emerald-800">
                    {milestone.year}
                  </div>
                  {/* Description Box */}
                  <div className="bg-white border border-slate-200/60 p-4 sm:p-5 rounded-2xl flex-1 shadow-sm group-hover:shadow-md transition-shadow self-center">
                    <p className="text-slate-900 font-bold text-xs sm:text-sm tracking-tight leading-snug">
                      {milestone.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE ENGAGEMENT CALL TO ACTION (CTA) ──────────── */}
      <section className="py-24 px-4 text-center bg-white border-t border-slate-200/60">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Ready to Experience Divine Care?
          </h2>
          <p className="text-slate-500 text-sm sm:text-base font-normal max-w-md mx-auto leading-relaxed">
            Initialize an operational scheduling request today or correspond
            directly with our medical administrative hub.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/appointments"
              className="inline-flex items-center justify-center bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs tracking-wider uppercase px-6 py-4 rounded-xl shadow-md transition-colors gap-2"
            >
              Book Appointment{" "}
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-bold text-xs tracking-wider uppercase px-6 py-4 rounded-xl shadow-sm transition-colors"
            >
              Contact Administrative Hub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
