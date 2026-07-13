"use client";

import { useState, useEffect } from "react";
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
  Eye,
  Baby,
  Stethoscope,
  Syringe,
  ChevronRight,
  MapPin,
  CheckCircle,
  Quote,
} from "lucide-react";

const stats = [
  { value: "10+", label: "Years of Service", icon: Award },
  { value: "24/7", label: "Emergency Care", icon: Clock },
  { value: "4.4★", label: "Google Rating", icon: Star },
  { value: "1000+", label: "Happy Patients", icon: Heart },
];

const services = [
  {
    icon: Stethoscope,
    title: "General Consultation",
    description:
      "Expert medical consultations with our qualified physicians for all your health concerns.",
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    href: "/services#opd",
  },
  {
    icon: Baby,
    title: "Maternity & Delivery",
    description:
      "Comprehensive maternal care from prenatal to postnatal, known as the best in Kumasi.",
    color: "bg-teal-50 text-teal-700 border-teal-100",
    href: "/services#maternity",
  },
  {
    icon: Microscope,
    title: "Laboratory Services",
    description:
      "State-of-the-art laboratory testing for accurate diagnosis and monitoring.",
    color: "bg-cyan-50 text-cyan-700 border-cyan-100",
    href: "/services#laboratory",
  },
  {
    icon: Heart,
    title: "Surgical Services",
    description:
      "Advanced surgical procedures performed by our experienced surgical team.",
    color: "bg-rose-50 text-rose-700 border-rose-100",
    href: "/services#surgery",
  },
  {
    icon: Eye,
    title: "Eye Clinic",
    description:
      "Comprehensive eye care services from routine checkups to complex treatments.",
    color: "bg-amber-50 text-amber-700 border-amber-100",
    href: "/services#eye-clinic",
  },
  {
    icon: Syringe,
    title: "Emergency Care",
    description:
      "24/7 emergency services with rapid response and expert trauma care.",
    color: "bg-red-50 text-red-700 border-red-100",
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
      "Divine Netcare Hospital provides compassionate, elite healthcare to families across Kumasi. From general family medicine to premier maternity setups, our expert clinical teams are always by your side, ensuring rapid recovery and reliable diagnostic monitoring around the clock.",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&h=450&fit=crop",
    alt: "Expert Doctor at Divine Netcare",
    badge: "Physicians Active Now",
  },
  {
    titleHighlight: "Premier Maternity",
    description:
      "Welcoming new life into the world with absolute clinical safety and unparalleled warmth. Discover why we host the top-rated maternity rooms, delivery suites, and neonatal amenities within the Ashanti region, managed by compassionate expert midwives.",
    image:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=450&fit=crop",
    alt: "Maternal Care Excellence",
    badge: "Best Maternity Care in Kumasi",
  },
  {
    titleHighlight: "Modern Diagnostics",
    description:
      "Equipped with state-of-the-art medical infrastructure and advanced laboratory tools. Get highly accurate results swiftly to support your targeted clinical recovery paths, routine wellness tests, and urgent emergency profiles when seconds count.",
    image:
      "https://images.unsplash.com/photo-1579154204601-01588f351167?w=600&h=450&fit=crop",
    alt: "Advanced Medical Lab Equipment",
    badge: "24/7 Laboratory Active",
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsAnimating(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-50 overflow-x-hidden text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* ── 1. FIXED RESPONSIVE HERO SECTION ──────────────────────── */}
      <section className="relative min-h-[75vh] md:min-h-[80vh] flex items-center bg-white pt-24 pb-10 lg:py-16 overflow-hidden">
        <div className="absolute top-[-5%] right-[-5%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-emerald-50 rounded-full blur-[60px] sm:blur-[120px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content Column */}
          <div className="lg:col-span-6 space-y-5 md:space-y-6 text-center lg:text-left max-w-xl mx-auto lg:mx-0 self-center">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold tracking-wide uppercase px-3.5 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full relative flex">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Open 24/7 · Kronum-Abouhia, Kumasi
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Your Health, <br className="hidden sm:inline" />
              <span
                className={`inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-500 transform ${
                  isAnimating
                    ? "opacity-0 translate-y-1"
                    : "opacity-100 translate-y-0"
                }`}
              >
                {heroSlides[currentSlide].titleHighlight}
              </span>
            </h1>

            <p
              className={`text-slate-600 text-sm sm:text-base md:text-lg font-normal leading-relaxed transition-all duration-500 ${
                isAnimating ? "opacity-0" : "opacity-100"
              }`}
            >
              {heroSlides[currentSlide].description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
              <Link
                href="/appointments"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition-all duration-250 text-sm"
              >
                <Calendar className="w-4 h-4 opacity-90 group-hover:scale-110 transition-transform" />
                Book Appointment
              </Link>
              <a
                href="tel:+233501812304"
                className="inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold px-6 py-3.5 rounded-xl border border-slate-200 shadow-sm transition-all duration-250 text-sm"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                Emergency Line
              </a>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center lg:justify-start gap-2 pt-1">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setCurrentSlide(index);
                      setIsAnimating(false);
                    }, 350);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "w-5 bg-emerald-600"
                      : "w-1.5 bg-slate-200 hover:bg-slate-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Balanced Graphic Column */}
          <div className="lg:col-span-6 w-full flex flex-col items-center relative self-center">
            <div className="relative w-full max-w-[480px] lg:max-w-none aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-lg">
              <div
                className={`relative w-full h-full transition-all duration-700 ease-in-out ${
                  isAnimating
                    ? "opacity-40 scale-[0.98] blur-xs"
                    : "opacity-100 scale-100 blur-none"
                }`}
              >
                <Image
                  src={heroSlides[currentSlide].image}
                  alt={heroSlides[currentSlide].alt}
                  fill
                  sizes="(max-w-7xl) 100vw, 50vw"
                  className="object-cover object-center filter contrast-[1.01]"
                  priority
                />
              </div>
            </div>

            {/* Floating Info Pill */}
            <div
              className={`absolute top-4 right-4 bg-white/90 backdrop-blur-md py-1.5 px-3 rounded-full shadow-sm border border-slate-200/50 flex items-center gap-2 transition-all duration-500 ${
                isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-800">
                {heroSlides[currentSlide].badge}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. QUICK LINKS GRID ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20 -mt-2 lg:-mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          {[
            {
              icon: Calendar,
              label: "Book Appointment",
              href: "/appointments",
              grad: "from-emerald-600 to-emerald-700 text-white",
            },
            {
              icon: Phone,
              label: "Emergency Call",
              href: "tel:+233501812304",
              grad: "from-rose-600 to-rose-700 text-white",
            },
            {
              icon: MapPin,
              label: "Find Our Clinic",
              href: "/contact",
              grad: "from-slate-800 to-slate-900 text-white",
            },
            {
              icon: Users,
              label: "Our Specialists",
              href: "/doctors",
              grad: "from-teal-600 to-teal-700 text-white",
            },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className={`bg-gradient-to-br ${action.grad} rounded-xl p-3.5 sm:p-5 flex flex-col items-center justify-center gap-2 text-center shadow-sm hover:shadow-md transition-all duration-200 group`}
            >
              <div className="p-1.5 bg-white/10 rounded-lg group-hover:scale-105 transition-transform">
                <action.icon className="w-4 h-4 sm:w-5 h-5" />
              </div>
              <span className="font-bold text-[11px] sm:text-xs md:text-sm tracking-wide">
                {action.label}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── 3. SERVICES HUB ─────────────────────────────────── */}
      <section className="py-14 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-2.5">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            What We Offer
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Healthcare Services
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm md:text-base">
            From routine diagnostics to high-precision care, our medical teams
            support your wellness journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group bg-white p-5 sm:p-6 border border-slate-200/60 rounded-xl hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${service.color} border rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}
                >
                  <service.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-1.5 group-hover:text-emerald-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed mb-4">
                  {service.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-[11px] sm:text-xs font-bold">
                Learn More <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. BRAND STORY & CORE PROPOSITIONS ──────────────── */}
      <section className="py-14 sm:py-24 bg-white border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5 relative w-full max-w-[380px] lg:max-w-none mx-auto aspect-[4/5] sm:aspect-[1.2] lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&h=700&fit=crop"
              alt="Elite Medical Team at Divine Netcare"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Why Divine Netcare
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Clinical Excellence Built with Genuine Compassion
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0">
              At Divine Netcare Hospital, we believe every patient deserves
              global-standard treatment. Our operations run smoothly under
              absolute expert precision.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-left max-w-lg mx-auto lg:mx-0">
              {whyChooseUs.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-[11px] sm:text-xs font-medium">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 5. MINI ACTION HERO (CTA) ───────────────────────── */}
      <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 sm:p-12 text-center relative overflow-hidden shadow-md">
          <div className="relative max-w-xl mx-auto space-y-4">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Ready to See a Doctor?
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Book Your Consultation Today
            </h2>
            <p className="text-slate-300 text-[11px] sm:text-xs max-w-md mx-auto leading-relaxed">
              Skip traditional waiting lines. Secure custom consultation blocks
              with seasoned clinicians safely online.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-1">
              <Link
                href="/appointments"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 text-emerald-950 font-bold px-5 py-3 rounded-lg shadow-sm transition-colors text-xs"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Book Online Now
              </Link>
              <a
                href="tel:+233501812304"
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold px-5 py-3 rounded-lg border border-white/10 backdrop-blur-sm transition-colors text-xs"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                Call Us Direct
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FEEDBACK & GOOGLE REVIEWS ───────────────────── */}
      <section className="py-14 bg-white px-4 sm:px-6 border-t border-slate-200/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-md mx-auto mb-10 space-y-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Patient Voices
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Stories of Healing & Hope
            </h2>
            <div className="flex items-center justify-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-3 h-3 text-amber-400 fill-amber-400"
                />
              ))}
              <span className="text-slate-600 font-bold text-[11px] ml-1.5">
                4.4 Google Rating
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviews.map((review) => (
              <div
                key={review.name}
                className="bg-slate-50 border border-slate-200/40 p-4 rounded-xl flex flex-col justify-between hover:bg-slate-100/40 transition-colors"
              >
                <div>
                  <Quote className="w-4 h-4 text-emerald-200 mb-2 stroke-[2]" />
                  <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed mb-3 italic">
                    &quot;{review.text}&quot;
                  </p>
                </div>
                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-200/40">
                  <div className="w-7 h-7 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-full flex items-center justify-center font-bold text-[10px]">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-[11px] sm:text-xs">
                      {review.name}
                    </p>
                    <span className="text-slate-400 text-[9px]">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. ARTICLES & ESSAYS ────────────────────────────── */}
      <section className="py-14 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8 text-center sm:text-left">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            Health Insights
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
            Latest Articles from Our Clinicians
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.title}
              href="/blog"
              className="bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-2xs hover:shadow-sm transition-shadow flex flex-col h-full group"
            >
              <div className="relative w-full aspect-[16/10] bg-slate-50">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-w-7xl) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <p className="text-slate-400 text-[10px] mb-0.5">
                    {post.date}
                  </p>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug mb-1.5 group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-bold mt-3">
                  Read Article <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 8. GROUND FLOOR ACCESS & METADATA ───────────────── */}
      <section className="py-14 bg-slate-100/60 border-t border-slate-200/40 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Find Us
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Located in the Heart of Kumasi
            </h2>
            <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed max-w-sm mx-auto lg:mx-0">
              We are located at Kronum-Abouhia, Kumasi in the Ashanti Region.
              Complete street approach with specialized compound parking.
            </p>

            <div className="space-y-3 pt-1 text-left max-w-xs mx-auto lg:mx-0">
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
                  <div className="w-8 h-8 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-slate-800 font-bold text-xs">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 rounded-xl overflow-hidden border border-slate-200 h-64 bg-slate-200 relative w-full max-w-[450px] lg:max-w-none mx-auto group">
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
        </div>
      </section>
    </div>
  );
}
