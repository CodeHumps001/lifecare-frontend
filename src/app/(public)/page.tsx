"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Calendar,
  Star,
  ArrowRight,
  Clock,
  Award,
  Users,
  Heart,
  Microscope,
  Baby,
  Stethoscope,
  Syringe,
  ChevronRight,
  MapPin,
  CheckCircle,
  Quote,
  Ear,
} from "lucide-react";

const services = [
  {
    icon: Stethoscope,
    title: "General Consultation",
    description:
      "Sit down with a physician who listens first. Whatever's bothering you, we'll get to the bottom of it.",
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    ring: "group-hover:ring-emerald-200",
    href: "/services#opd",
  },
  {
    icon: Baby,
    title: "Maternity & Delivery",
    description:
      "From your first scan to your baby's first cry — care known as the best in Kumasi, every step of the way.",
    color: "bg-teal-50 text-teal-700 border-teal-100",
    ring: "group-hover:ring-teal-200",
    href: "/services#maternity",
  },
  {
    icon: Microscope,
    title: "Laboratory Services",
    description:
      "Fast, accurate testing so you're not left waiting and wondering. Results you and your doctor can trust.",
    color: "bg-cyan-50 text-cyan-700 border-cyan-100",
    ring: "group-hover:ring-cyan-200",
    href: "/services#laboratory",
  },
  {
    icon: Heart,
    title: "Surgical Services",
    description:
      "When a procedure is needed, our surgical team brings steady hands and a plan you understand.",
    color: "bg-rose-50 text-rose-700 border-rose-100",
    ring: "group-hover:ring-rose-200",
    href: "/services#surgery",
  },
  {
    icon: Ear,
    title: "ENT Clinic",
    description:
      "Hearing, sinus, and throat care from specialists who take everyday discomfort seriously.",
    color: "bg-cyan-50 text-cyan-700 border-cyan-100",
    ring: "group-hover:ring-cyan-200",
    href: "/services#ent-clinic",
  },
  {
    icon: Syringe,
    title: "Emergency Care",
    description:
      "Day or night, our emergency team is ready the moment you walk through the door.",
    color: "bg-red-50 text-red-700 border-red-100",
    ring: "group-hover:ring-red-200",
    href: "/services#emergency",
  },
];

const reviews = [
  {
    name: "Nana Yaw",
    rating: 5,
    text: "Very nice hospital, the nurses are good, very respectful, caring. I will advise you to go there whenever you are feeling unwell.",
    date: "4 years ago",
    avatar: "NY",
  },
  {
    name: "Appiah Holiness",
    rating: 5,
    text: "Best place for pregnant women to deliver. The maternity team is exceptional and very professional.",
    date: "1 year ago",
    avatar: "AH",
  },
  {
    name: "Selase Kokuma",
    rating: 5,
    text: "Quality health care delivery, great customer service. The staff made me feel at home throughout my treatment.",
    date: "5 years ago",
    avatar: "SK",
  },
  {
    name: "Felix Antwi",
    rating: 3,
    text: "Our Care Is DeVine. Great customer service and professional staff who take their work seriously.",
    date: "4 years ago",
    avatar: "FA",
  },
];

const whyChooseUs = [
  "Experienced and compassionate medical team",
  "Modern medical equipment and facilities",
  "Wheelchair accessible premises",
  "NFC mobile payment support",
  "24/7 emergency response",
  "Best maternity care in Kumasi",
  "Affordable quality healthcare",
  "Clean, safe environment",
];

const blogPosts = [
  {
    title: "Breast Cancer Awareness: What Every Woman Should Know",
    excerpt:
      "Early detection saves lives. Learn about the importance of regular breast screening and self-examination.",
    image:
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=250&fit=crop",
    date: "October 22, 2024",
    category: "Women's Health",
  },
  {
    title: "The Importance of Prenatal Care During Pregnancy",
    excerpt:
      "Regular prenatal visits are crucial for both mother and baby. Our maternity team explains what to expect.",
    image:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=250&fit=crop",
    date: "September 15, 2024",
    category: "Maternity",
  },
  {
    title: "Managing Diabetes in Ghana: Tips From Our Specialists",
    excerpt:
      "Diabetes is increasingly common in Ghana. Our doctors share practical lifestyle and dietary advice.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop",
    date: "August 5, 2024",
    category: "General Health",
  },
];

const heroSlides = [
  {
    titleHighlight: "Our Divine Care",
    description:
      "Compassionate, elite healthcare for families across Kumasi — from everyday family medicine to premier maternity care, our clinical teams are with you around the clock.",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1600&h=1000&fit=crop",
    alt: "Expert Doctor at Divine Netcare",
    badge: "Physicians Active Now",
  },
  {
    titleHighlight: "Premier Maternity",
    description:
      "Welcoming new life with real clinical safety and real warmth. Top-rated delivery suites and neonatal care in the Ashanti region, led by compassionate midwives.",
    image:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1600&h=1000&fit=crop",
    alt: "Maternal Care Excellence",
    badge: "Best Maternity Care in Kumasi",
  },
  {
    titleHighlight: "Modern Diagnostics",
    description:
      "State-of-the-art laboratory tools and imaging, so you get clear answers quickly — for routine checkups and urgent cases alike.",
    image:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=700&h=450&fit=crop",
    alt: "Advanced Medical Lab Equipment",
    badge: "24/7 Laboratory Active",
  },
];

const quickActions = [
  {
    icon: Calendar,
    label: "Book Appointment",
    sub: "Pick a time that works",
    href: "/appointments",
  },
  {
    icon: Phone,
    label: "Emergency Call",
    sub: "+233 50 181 2304",
    href: "tel:+233501812304",
  },
  {
    icon: MapPin,
    label: "Find Our Clinic",
    sub: "Kronum-Abouhia, Kumasi",
    href: "/contact",
  },
  {
    icon: Users,
    label: "Our Specialists",
    sub: "Meet the team",
    href: "/doctors",
  },
];

const stats = [
  {
    icon: Award,
    target: 10,
    decimals: 0,
    suffix: "+",
    label: "Years of Service",
  },
  {
    icon: Clock,
    target: 24,
    decimals: 0,
    suffix: "/7",
    label: "Emergency Care",
  },
  { icon: Star, target: 4.4, decimals: 1, suffix: "★", label: "Google Rating" },
  {
    icon: Heart,
    target: 1000,
    decimals: 0,
    suffix: "+",
    label: "Happy Patients",
  },
];

/* ── Scroll-triggered reveal ──────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Animated count-up ────────────────────────────────────── */
function useCountUp(
  target: number,
  start: boolean,
  decimals = 0,
  duration = 1600,
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf: number;
    let startTs: number | null = null;

    const step = (ts: number) => {
      if (startTs === null) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Number((eased * target).toFixed(decimals)));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration, decimals]);

  return value;
}

function StatCounter({
  stat,
  inView,
  index,
}: {
  stat: (typeof stats)[number];
  inView: boolean;
  index: number;
}) {
  const value = useCountUp(stat.target, inView, stat.decimals);
  return (
    <div
      className={`flex flex-col items-center text-center gap-2 transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
        <stat.icon className="w-5 h-5 text-emerald-300" />
      </div>
      <p className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
        {value}
        {stat.suffix}
      </p>
      <p className="text-emerald-200/70 text-xs sm:text-sm font-medium">
        {stat.label}
      </p>
    </div>
  );
}

/* ── Signature motif: heartbeat pulse line ────────────────── */
function PulseDivider() {
  return (
    <div className="relative py-10 sm:py-14 flex items-center justify-center overflow-hidden">
      <div className="max-w-3xl w-full px-6">
        <svg
          viewBox="0 0 400 40"
          preserveAspectRatio="none"
          className="w-full h-10"
        >
          <path
            d="M0 20 L145 20 L160 20 L173 3 L186 37 L199 20 L400 20"
            fill="none"
            stroke="#059669"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            className="pulse-path"
          />
        </svg>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [statsRef, statsInView] = useInView(0.3);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsAnimating(false);
      }, 500);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 350);
  };

  return (
    <div className="bg-slate-50 overflow-x-hidden text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes pulseTravel {
          0% {
            stroke-dashoffset: 1;
          }
          100% {
            stroke-dashoffset: -1;
          }
        }
        .pulse-path {
          stroke-dasharray: 0.045 0.955;
          animation: pulseTravel 2.6s linear infinite;
        }
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 32s linear infinite;
        }
        .marquee-pause:hover .animate-marquee {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up,
          .pulse-path,
          .animate-marquee {
            animation: none !important;
          }
        }
      `}</style>

      {/* ── 1. FULL-BLEED PHOTOGRAPHIC HERO ──────────────────────── */}
      <section className="relative min-h-[88vh] flex items-end overflow-hidden bg-slate-950">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-cover object-center transition-transform duration-[6000ms] ease-out ${
                index === currentSlide ? "scale-105" : "scale-100"
              }`}
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-24 sm:pb-28">
          <div className="max-w-xl space-y-6">
            <div
              className="animate-fade-up inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-[11px] sm:text-xs font-bold tracking-wide uppercase px-3.5 py-2 rounded-full"
              style={{ animationDelay: "0ms" }}
            >
              <span className="w-2 h-2 relative flex">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Open 24/7 · Kronum-Abouhia, Kumasi
            </div>

            <h1
              className="animate-fade-up text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]"
              style={{ animationDelay: "120ms" }}
            >
              Your Health,{" "}
              <span
                className={`inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-500 ${
                  isAnimating
                    ? "opacity-0 translate-y-1"
                    : "opacity-100 translate-y-0"
                }`}
              >
                {heroSlides[currentSlide].titleHighlight}
              </span>
            </h1>

            <p
              className={`animate-fade-up text-slate-200 text-base sm:text-lg leading-relaxed transition-opacity duration-500 ${
                isAnimating ? "opacity-0" : "opacity-100"
              }`}
              style={{ animationDelay: "220ms" }}
            >
              {heroSlides[currentSlide].description}
            </p>

            <div
              className="animate-fade-up flex flex-col sm:flex-row gap-3 pt-2"
              style={{ animationDelay: "320ms" }}
            >
              <Link
                href="/appointments"
                className="group inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-950/30 transition-colors text-sm"
              >
                <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Book Appointment
              </Link>
              <a
                href="tel:+233501812304"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/20 backdrop-blur-sm transition-colors text-sm"
              >
                <Phone className="w-4 h-4 text-emerald-300" />
                Emergency Line
              </a>
            </div>

            <div
              className="animate-fade-up flex items-center gap-4 pt-2"
              style={{ animationDelay: "420ms" }}
            >
              <div
                className={`inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold text-white/80 transition-opacity duration-500 ${
                  isAnimating ? "opacity-0" : "opacity-100"
                }`}
              >
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-400" />
                </span>
                {heroSlides[currentSlide].badge}
              </div>
              <div className="flex gap-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? "w-6 bg-emerald-400"
                        : "w-1.5 bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FLOATING QUICK-ACTIONS BAR ────────────────────────── */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 -mt-12 sm:-mt-14">
        <div
          className="animate-fade-up bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 grid grid-cols-2 lg:grid-cols-4 divide-y divide-x-0 lg:divide-y-0 lg:divide-x divide-slate-100"
          style={{ animationDelay: "500ms" }}
        >
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex items-center gap-3 p-5 hover:bg-slate-50 transition-colors"
            >
              <div className="w-11 h-11 shrink-0 bg-emerald-50 group-hover:bg-emerald-100 rounded-xl flex items-center justify-center transition-all group-hover:-translate-y-0.5">
                <action.icon className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                  {action.label}
                </p>
                <p className="text-slate-400 text-[11px] truncate">
                  {action.sub}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. STATS BAND ────────────────────────────────────────── */}
      <section
        ref={statsRef}
        className="mt-16 sm:mt-20 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-14 grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
          {stats.map((stat, i) => (
            <StatCounter
              key={stat.label}
              stat={stat}
              inView={statsInView}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* ── 4. SERVICES HUB ─────────────────────────────────── */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-14 sm:mb-16 space-y-3">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            What We Offer
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Care for Every Stage of Life
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            From a routine checkup to urgent, round-the-clock care — our teams
            are here for you and your family.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {services.map((service, i) => (
            <Reveal
              key={service.title}
              delay={i * 90}
              className={i % 2 === 1 ? "lg:translate-y-6" : ""}
            >
              <Link
                href={service.href}
                className={`group bg-white p-6 sm:p-7 border border-slate-200/70 rounded-2xl ring-1 ring-transparent hover:border-transparent ${service.ring} hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full hover:-translate-y-1`}
              >
                <div>
                  <div
                    className={`w-12 h-12 ${service.color} border rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <service.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">
                    {service.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                  Learn more{" "}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 5. BRAND STORY & CORE PROPOSITIONS ──────────────── */}
      <section className="py-20 sm:py-28 bg-white border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <Reveal className="lg:col-span-5 relative w-full max-w-[420px] lg:max-w-none mx-auto">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=700&h=850&fit=crop"
                alt="Elite Medical Team at Divine Netcare"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 sm:-right-8 bg-white rounded-2xl shadow-xl border border-slate-100 px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-900 leading-none">
                  1000+
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
                  patients treated
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal
            delay={150}
            className="lg:col-span-7 space-y-5 text-center lg:text-left"
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Why Divine Netcare
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Care That Treats You Like Family
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              We know a hospital visit can be stressful. That's why we pair
              skilled, experienced clinicians with genuine warmth — so you
              always feel heard, and never just like a number.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-3 text-left max-w-lg mx-auto lg:mx-0">
              {whyChooseUs.map((item, i) => (
                <Reveal key={item} delay={200 + i * 60}>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-xs sm:text-sm font-medium leading-snug">
                      {item}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── 6. SIGNATURE PULSE DIVIDER ──────────────────────── */}
      <PulseDivider />

      {/* ── 7. MINI ACTION HERO (CTA) ───────────────────────── */}
      <section className="pb-20 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-lg">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="relative max-w-xl mx-auto space-y-5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Ready to See a Doctor?
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Book Your Consultation Today
              </h2>
              <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                No more waiting in line. Choose a time that suits you, and see
                one of our clinicians without the wait.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link
                  href="/appointments"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 text-emerald-950 font-bold px-6 py-3.5 rounded-xl shadow-sm transition-colors text-sm"
                >
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Book Online Now
                </Link>
                <a
                  href="tel:+233501812304"
                  className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/10 backdrop-blur-sm transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  Call Us Direct
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── 8. FEEDBACK & GOOGLE REVIEWS (MARQUEE) ──────────── */}
      <section className="py-20 sm:py-28 bg-white border-t border-slate-200/40">
        <Reveal className="max-w-md mx-auto text-center mb-14 space-y-2.5 px-4">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            Patient Voices
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Stories of Healing & Hope
          </h2>
          <div className="flex items-center justify-center gap-0.5 pt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
              />
            ))}
            <span className="text-slate-600 font-bold text-xs ml-1.5">
              4.4 Google Rating
            </span>
          </div>
        </Reveal>

        <div className="marquee-pause relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-marquee flex gap-5 w-max px-4">
            {[...reviews, ...reviews].map((review, i) => (
              <div
                key={`${review.name}-${i}`}
                className="bg-slate-50 border border-slate-200/50 p-5 rounded-2xl flex flex-col justify-between w-72 sm:w-80 shrink-0"
              >
                <div>
                  <Quote className="w-5 h-5 text-emerald-200 mb-3 stroke-[2]" />
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 italic">
                    &quot;{review.text}&quot;
                  </p>
                </div>
                <div className="flex items-center gap-2.5 pt-3 border-t border-slate-200/50">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-full flex items-center justify-center font-bold text-[11px] shrink-0">
                    {review.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">
                      {review.name}
                    </p>
                    <span className="text-slate-400 text-[10px]">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. ARTICLES & ESSAYS ────────────────────────────── */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="mb-12 text-center sm:text-left max-w-xl">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            Health Insights
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            Latest From Our Clinicians
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {blogPosts.map((post, i) => (
            <Reveal key={post.title} delay={i * 100}>
              <Link
                href="/blog"
                className="group bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="relative w-full aspect-[16/10] bg-slate-50 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <p className="text-slate-400 text-[11px] mb-1.5">
                      {post.date}
                    </p>
                    <h3 className="font-bold text-base text-slate-900 leading-snug mb-2 group-hover:text-emerald-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-4">
                    Read article{" "}
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 10. GROUND FLOOR ACCESS & METADATA ───────────────── */}
      <section className="py-20 sm:py-24 bg-slate-100/60 border-t border-slate-200/40 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <Reveal className="lg:col-span-5 space-y-5 text-center lg:text-left">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Find Us
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Located in the Heart of Kumasi
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
              We're at Kronum-Abouhia, Kumasi in the Ashanti Region — easy
              street access with dedicated compound parking.
            </p>

            <div className="space-y-3.5 pt-2 text-left max-w-xs mx-auto lg:mx-0">
              {[
                {
                  icon: MapPin,
                  label: "Address",
                  value: "Kronum-Abouhia, Kumasi, Ashanti Region",
                },
                {
                  icon: Phone,
                  label: "Phone Contact",
                  value: "+233 50 181 2304",
                },
                {
                  icon: Clock,
                  label: "Operating Hours",
                  value: "Open 24/7 — Emergency Active",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-slate-800 font-bold text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal
            delay={150}
            className="lg:col-span-7 w-full max-w-[500px] lg:max-w-none mx-auto"
          >
            <div className="rounded-2xl overflow-hidden border border-slate-200 h-72 sm:h-80 bg-slate-200 relative w-full group shadow-sm hover:shadow-md transition-shadow duration-300">
              <iframe
                title="Divine Netcare Hospital Verified Location View"
                src="https://maps.google.com/maps?q=Divine%20Netcare%20Hospital,%20Kumasi,%20Ghana&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 object-cover"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200/60 p-3.5 rounded-xl flex items-center justify-between shadow-md pointer-events-none group-hover:bg-white transition-colors duration-300">
                <div className="space-y-0.5 min-w-0">
                  <p className="font-extrabold text-slate-950 text-xs tracking-tight truncate">
                    Divine Netcare Hospital
                  </p>
                  <p className="text-slate-500 text-[11px] font-normal truncate">
                    Afrancho-Buoho, Off Offinso Rd
                  </p>
                </div>
                <a
                  href="https://maps.app.goo.gl/wd5U7mHUN3RW14US6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-950 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg pointer-events-auto shadow-sm hover:bg-emerald-700 transition-colors shrink-0 ml-3"
                >
                  Get Route
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
