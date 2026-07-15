import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Phone,
  CheckCircle,
  Star,
  ShieldAlert,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Medical Services | Divine Netcare Hospital",
  description:
    "Divine Netcare Hospital offers general consultations, specialized maternity care, laboratory services, surgery, eye clinic, and 24/7 emergency care in Kumasi.",
};

const services = [
  {
    id: "opd",
    title: "Outpatient Department (OPD)",
    subtitle: "General Consultations & Primary Care",
    description:
      "Our OPD is the first point of contact for most patients. Our qualified physicians provide thorough consultations, diagnose conditions, and create personalized treatment plans. We handle everything from minor ailments to complex referral cases.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&h=450&fit=crop",
    features: [
      "General physician consultations",
      "Chronic disease management",
      "Health screenings and checkups",
      "Prescription and medication review",
      "Referrals to specialists",
      "Follow-up care",
    ],
    hours: "Monday – Sunday: 24 Hours",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "maternity",
    title: "Maternity & Delivery",
    subtitle: "Best Maternity Care in Kumasi",
    description:
      "Our maternity unit is recognized by our patients as the best in Kumasi. We provide comprehensive care throughout your pregnancy journey — from prenatal consultations to safe delivery and postnatal support. Our experienced midwives and obstetricians ensure both mother and baby receive the best care.",
    image:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=700&h=450&fit=crop",
    features: [
      "Antenatal care and monitoring",
      "Safe normal and cesarean deliveries",
      "Postnatal care and breastfeeding support",
      "Newborn screening and care",
      "Family planning services",
      "Gynecological consultations",
    ],
    hours: "24/7 — We never close for deliveries",
    highlight: true,
    color: "from-teal-500 to-emerald-600",
  },
  {
    id: "laboratory",
    title: "Laboratory Services",
    subtitle: "Accurate Diagnostics",
    description:
      "Our modern laboratory is equipped with state-of-the-art equipment to deliver fast, accurate test results. We conduct a wide range of diagnostic tests to help our doctors make accurate diagnoses and monitor your health effectively.",
    image:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=700&h=450&fit=crop",
    features: [
      "Blood tests and full blood count",
      "Urinalysis and urine culture",
      "Malaria and typhoid testing",
      "HIV/AIDS testing (confidential)",
      "Liver and kidney function tests",
      "Pregnancy tests",
    ],
    hours: "Monday – Sunday: 7:00AM – 9:00PM",
    color: "from-emerald-600 to-cyan-600",
  },
  {
    id: "surgery",
    title: "Surgical Services",
    subtitle: "Expert Surgical Care",
    description:
      "Our surgical team performs a wide range of procedures in our modern operating theatre. From minor outpatient procedures to major surgeries, our experienced surgeons and anaesthetists ensure your safety and comfort throughout.",
    image:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?w=700&h=450&fit=crop",
    features: [
      "Minor and major surgical procedures",
      "Caesarean sections",
      "Hernia repair",
      "Appendectomy",
      "Wound care and dressing",
      "Pre and post-operative care",
    ],
    hours: "Scheduled procedures: Mon–Fri. Emergencies: 24/7",
    color: "from-teal-600 to-emerald-700",
  },
  {
    id: "ent-clinic",
    title: "Ear, Nose & Throat (ENT) Clinic",
    subtitle: "Specialist Otolaryngology Services",
    description:
      "Our specialist ENT clinic offers comprehensive diagnostics and advanced treatments for a wide range of ear, nose, throat, head, and neck conditions. From micro-suction ear clearance to sinus therapies, our clinical team delivers premium care.",
    image:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=700&h=450&fit=crop",
    features: [
      "Comprehensive hearing assessments & audiometry tests",
      "Sinus, allergy, and nasal congestion treatments",
      "Throat, voice, and swallowing evaluation",
      "Tonsillitis and adenoid infection management",
      "Micro-suction ear wax removal and tinnitus advice",
      "Direct referrals to head and neck otolaryngologists",
    ],
    hours: "Monday – Friday: 8:00AM – 5:00PM",
    color: "from-blue-600 to-cyan-500",
  },
  {
    id: "emergency",
    title: "Emergency Services",
    subtitle: "24/7 Emergency Response",
    description:
      "Medical emergencies don't wait — and neither do we. Our emergency department is staffed around the clock with trained medical personnel ready to respond quickly to all types of emergencies. We are equipped to stabilize and treat critical patients.",
    image:
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=700&h=450&fit=crop",
    features: [
      "24/7 emergency response",
      "Trauma and accident care",
      "Resuscitation services",
      "Emergency surgery",
      "IV fluids and medications",
      "Ambulance coordination",
    ],
    hours: "24 hours, 7 days a week",
    emergency: true,
    color: "from-rose-600 to-red-700",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-slate-50 text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* ── HERO SECTION ───────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-center bg-slate-950 py-20 px-4 overflow-hidden">
        {/* Crisp Background Layer with Reduced Green Dominance */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1600&h=600&fit=crop"
            alt="Divine Netcare Medical Infrastructure"
            fill
            className="object-cover opacity-35 filter brightness-95"
            priority
          />
          {/* Linear Mask to retain dark, ultra-premium contrast over text */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-emerald-950/20" />
        </div>

        {/* Decorative subtle vector ambient blurs */}
        <div className="absolute -top-12 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 text-emerald-300 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full backdrop-blur-md">
            Clinical Excellence
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Comprehensive <br className="sm:hidden" /> Healthcare Services
          </h1>
          <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            From routine consultations to complex diagnostic or surgical
            procedures, we offer a full ecosystem of medical services carefully
            tuned to your wellbeing.
          </p>
        </div>
      </section>

      {/* ── SERVICES BLOCK LAYOUT ──────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-24 sm:space-y-32">
          {services.map((service, index) => (
            <div
              key={service.id}
              id={service.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center scroll-mt-24 ${
                index % 2 === 1
                  ? "lg:flex lg:flex-row-reverse"
                  : "lg:flex lg:flex-row"
              }`}
            >
              {/* Image Container with Dynamic Context Ribbons */}
              <div className="w-full lg:w-1/2 relative group">
                <div className="relative h-64 sm:h-85 md:h-96 rounded-3xl overflow-hidden border border-slate-200/60 shadow-lg shadow-slate-200/50 bg-white">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  />
                  {/* Gentle gradient overlay to give context depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
                </div>

                {/* Conditional Dynamic Micro-badges */}
                {service.highlight && (
                  <div className="absolute -top-3 right-3 sm:right-6 inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg border border-amber-400/20">
                    <Star className="w-3.5 h-3.5 fill-current" /> Premium Wing
                  </div>
                )}
                {service.emergency && (
                  <div className="absolute -top-3 right-3 sm:right-6 inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg border border-red-500/20 animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping" />{" "}
                    Critical Care Available
                  </div>
                )}
              </div>

              {/* Content Description Area */}
              <div className="w-full lg:w-1/2 space-y-5 sm:space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100/80 px-3 py-1.5 rounded-lg inline-block mb-3">
                    {service.subtitle}
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    {service.title}
                  </h2>
                </div>

                <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
                  {service.description}
                </p>

                {/* Modularized Interactive Feature Bullets */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 pt-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 bg-emerald-50 border border-emerald-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span className="text-slate-600 text-xs sm:text-sm font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Timeline metadata strip */}
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 bg-slate-100/80 border border-slate-200/40 rounded-2xl px-4 py-3.5 mt-2">
                  <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    <strong>Operational Hours:</strong> {service.hours}
                  </span>
                </div>

                {/* Call to Actions - Form Factor Scaled cleanly for mobile layouts */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <Link
                    href="/appointments"
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md w-full sm:w-auto text-center"
                  >
                    Book Appointment <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="tel:+233501812304"
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm px-6 py-3.5 rounded-xl border border-slate-200 shadow-sm transition-all w-full sm:w-auto text-center"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" /> Call Unit
                    Direct
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXTRA HIGH RESPONSE EMERGENCY BANNER ───────────── */}
      <section className="py-20 bg-gradient-to-br from-red-700 via-rose-600 to-red-800 px-4 sm:px-6 relative overflow-hidden border-t-4 border-red-500">
        <div className="absolute inset-0 opacity-5 mix-blend-overlay">
          <div className="w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center text-white space-y-6 relative z-10">
          <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Experiencing a Medical Emergency?
          </h2>
          <p className="text-rose-100 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed font-normal">
            Do not delay treatment. Our rapid response urgent care center is
            fully equipped, staffed with on-call trauma teams, and running 24
            hours a day, 7 days a week.
          </p>
          <div className="pt-2">
            <a
              href="tel:+233558484862"
              className="inline-flex items-center justify-center gap-3 bg-white text-red-700 hover:bg-rose-50 font-extrabold px-8 py-4 rounded-xl transition-all text-base sm:text-lg shadow-xl shadow-red-950/20 w-full sm:w-auto text-center transform hover:-translate-y-0.5"
            >
              <Phone className="w-5 h-5 animate-bounce" />
              Call Emergency: +233 50 181 2304
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
