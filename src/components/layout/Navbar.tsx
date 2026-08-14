"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X, ChevronDown, Clock, MapPin } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  {
    href: "/services",
    label: "Services",
    children: [
      { href: "/services#opd", label: "OPD" },
      { href: "/services#maternity", label: "Maternity" },
      { href: "/services#laboratory", label: "Laboratory" },
      { href: "/services#surgery", label: "Surgery" },
      { href: "/services#eye-clinic", label: "E - N - T" },
      { href: "/services#emergency", label: "Emergency" },
    ],
  },
  { href: "/doctors", label: "Our Doctors" },
  { href: "/appointments", label: "Appointments" },
  { href: "/blog", label: "Health Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── TOP ADMINISTRATIVE UTILITY BAR ──────────────────────── */}
      <div className="bg-slate-950 text-white text-xs py-2.5 hidden md:block border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Open 24/7 — Emergency Triage Active
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Kronum-Abouhia, Kumasi, Ashanti Region
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+233558484862"
              className="flex items-center gap-1.5 text-slate-200 hover:text-emerald-400 font-semibold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              +233 50 181 2304
            </a>
            <span className="text-slate-800">|</span>
            <Link
              href="/admin/login"
              className="text-slate-300 hover:text-white transition-colors font-bold tracking-wide uppercase text-[10px]"
            >
              Staff Portals →
            </Link>
          </div>
        </div>
      </div>

      {/* ── CORE NAVIGATION HEADER MODULE ───────────────────────── */}
      <nav
        className={`md:sticky md:top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/60 py-2.5"
            : "bg-white border-b border-slate-100 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4  flex items-center justify-between">
          {/* Unified Graphical Logo Anchor */}
          <Link
            href="/"
            className="flex items-center block shrink-0 transition-opacity hover:opacity-90"
          >
            <Image
              src="/logo.jpeg"
              alt="Divine Netcare Hospital"
              width={100}
              height={60}
              className="h-300 sm:h-11 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation Map */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-slate-600 hover:text-slate-950 font-bold tracking-tight transition-colors text-sm rounded-lg hover:bg-slate-50">
                    {link.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${activeDropdown === link.label ? "rotate-180 text-slate-900" : ""}`}
                    />
                  </button>

                  {activeDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-slate-600 hover:text-slate-950 font-bold tracking-tight transition-colors text-sm rounded-lg hover:bg-slate-50"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          {/* Call to Action Buffer */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+233501812304"
              className="flex items-center gap-1.5 text-red-600 font-extrabold text-xs tracking-wider uppercase hover:text-red-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 animate-pulse" />
              ER Line
            </a>
            <Link
              href="/appointments"
              className="bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs tracking-wider uppercase px-4 py-3 rounded-xl shadow-sm transition-colors"
            >
              Book Appointment
            </Link>
          </div>

          {/* Mobile Navigation Interface Trigger */}
          <button
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors border border-transparent active:border-slate-200 focus:outline-none"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* ── MOBILE ACCORDION TRAY ────────────────────────────── */}
        {isMobileOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-1 animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => (
              <div key={link.href} className="space-y-0.5">
                <Link
                  href={link.href}
                  className="block px-3 py-2.5 text-sm font-bold text-slate-800 hover:text-slate-950 hover:bg-slate-50 rounded-xl transition-colors"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="pl-4 ml-2 border-l border-slate-200 space-y-0.5 pb-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-950 hover:bg-slate-50 rounded-lg transition-colors"
                        onClick={() => setIsMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 mt-2 border-t border-slate-200/80 space-y-2.5">
              <a
                href="tel:+233501812304"
                className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-red-50 text-red-700 font-extrabold text-xs tracking-wider uppercase"
              >
                <Phone className="w-4 h-4" />
                Emergency Hotline
              </a>
              <Link
                href="/appointments"
                className="w-full text-center block bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl shadow-sm transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                Book Appointment
              </Link>
              <Link
                href="/admin/login"
                className="w-full text-center block bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs tracking-wider uppercase py-3 rounded-xl transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                Staff Access
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
