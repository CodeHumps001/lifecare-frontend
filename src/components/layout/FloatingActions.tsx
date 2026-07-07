"use client";
import { Phone, MessageCircle } from "lucide-react";

export default function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp */}
      <a
        href="https://wa.me/233501812304"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-[#25D366] hover:bg-[#20b558] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 group"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
      </a>

      {/* Emergency call */}
      <a
        href="tel:+233501812304"
        className="w-12 h-12 bg-brand-primary hover:bg-green-800 text-white rounded-full flex items-center justify-center shadow-green shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 animate-pulse-slow"
        title="Emergency Call"
      >
        <Phone className="w-5 h-5" />
      </a>
    </div>
  );
}
