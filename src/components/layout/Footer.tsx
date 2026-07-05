import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Linkedin,
  Facebook,
  Heart,
} from "lucide-react";

const services = [
  "General Consultation",
  "Maternity & Delivery",
  "Laboratory Tests",
  "Surgical Services",
  "Eye Clinic",
  "Emergency Care",
  "Scan & Imaging",
  "OPD Services",
];

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/doctors", label: "Our Doctors" },
  { href: "/appointments", label: "Book Appointment" },
  { href: "/blog", label: "Health Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/reviews", label: "Patient Reviews" },
  { href: "/contact", label: "Contact Us" },
  { href: "/admin/login", label: "Staff Login" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Graphical Identity */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              {/* Logo asset containing full identity text */}
              <Link
                href="/"
                className="block transition-opacity hover:opacity-90"
              >
                <Link
                  href="/"
                  className="flex items-center block shrink-0 transition-opacity hover:opacity-90"
                >
                  <img
                    src="/logo.jpeg"
                    alt="Divine Netcare Hospital"
                    className="h-9 sm:h-11 w-auto object-contain"
                    // For the dark-themed footer, keep the inversion utility:
                    // className="h-12 w-auto object-contain brightness-0 invert"
                  />
                </Link>
              </Link>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Providing quality healthcare to the people of Kumasi and
              surrounding communities. Your health is our divine calling.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/divine_netcare_hospital"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 rounded-xl flex items-center justify-center transition-all duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 rounded-xl flex items-center justify-center transition-all duration-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 rounded-xl flex items-center justify-center transition-all duration-200"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services mapping */}
          <div>
            <h4 className="font-display font-bold text-white mb-5 text-sm uppercase tracking-wider text-slate-200">
              Our Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="text-slate-400 hover:text-emerald-400 text-sm transition-colors flex items-center gap-2 group font-medium"
                  >
                    <span className="w-1.5 h-1.5 bg-slate-800 group-hover:bg-emerald-400 rounded-full transition-colors" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links mapping */}
          <div>
            <h4 className="font-display font-bold text-white mb-5 text-sm uppercase tracking-wider text-slate-200">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-emerald-400 text-sm transition-colors flex items-center gap-2 group font-medium"
                  >
                    <span className="w-1.5 h-1.5 bg-slate-800 group-hover:bg-emerald-400 rounded-full transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details info card */}
          <div>
            <h4 className="font-display font-bold text-white mb-5 text-sm uppercase tracking-wider text-slate-200">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 text-sm leading-relaxed font-medium">
                  Kronum-Abouhia, Kumasi,
                  <br />
                  Ashanti Region, Ghana
                </span>
              </li>
              <li>
                <a
                  href="tel:+233558484862"
                  className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 text-sm font-semibold transition-colors group"
                >
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  +233 55 848 4862
                </a>
              </li>
              <li>
                <a
                  href="mailto:andrewdarkwah123@gmail.com"
                  className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 text-sm font-medium transition-colors"
                >
                  <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  andrewdarkwah123@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 pt-2 border-t border-slate-900">
                <Clock className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-slate-400 text-xs font-medium">
                  <p className="font-bold text-slate-200 text-sm mb-1.5">
                    Visiting Hours
                  </p>
                  <p>Morning: 5:30AM – 7:00AM</p>
                  <p>Afternoon: 12:00PM – 1:00PM</p>
                  <p className="text-emerald-400 font-bold mt-1.5">
                    Emergency: 24/7 Active
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Tactical Emergency Highlight Module */}
        <div className="mt-12 bg-red-950/20 border border-red-900/40 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-white text-lg tracking-tight">
              Medical Emergency?
            </p>
            <p className="text-slate-400 text-sm font-medium">
              Our emergency clinical team is active 24 hours a day, 7 days a
              week.
            </p>
          </div>
          <a
            href="tel:+233558484862"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider uppercase px-6 py-3.5 rounded-xl transition-all duration-150 whitespace-nowrap shadow-sm shadow-red-950"
          >
            <Phone className="w-4 h-4 animate-pulse" />
            Call Emergency Now
          </a>
        </div>

        {/* Base Copyright Matrix */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs font-semibold tracking-wide">
            © {new Date().getFullYear()} Divine Netcare Hospital. All rights
            reserved.
          </p>
          <p className="text-slate-500 text-xs font-bold tracking-wide flex items-center gap-1.5">
            Built with{" "}
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by
            LifeCare HMS
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-slate-500 hover:text-slate-300 text-xs font-semibold transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-slate-500 hover:text-slate-300 text-xs font-semibold transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
