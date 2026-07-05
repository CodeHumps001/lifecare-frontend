"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  ArrowLeft,
  User,
  Share2,
  Phone,
  ShieldAlert,
  HeartPulse,
} from "lucide-react";
import { postsAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    postsAPI
      .getOne(params.id)
      .then((res) => setPost(res?.data?.data || null))
      .catch(() =>
        setPost({
          title: "Breast Cancer Awareness: What Every Woman Should Know",
          content: `Early detection saves lives. Breast cancer is one of the most common cancers affecting women in Ghana and across Africa. At Divine Netcare Hospital, we are committed to raising awareness and providing the screening and treatment services you need.\n\nRegular breast self-examination is a simple but powerful tool. Every woman should perform a self-check monthly, ideally a few days after your menstrual period ends. You are looking for any changes in the shape or size of your breast, unusual lumps or thickening, changes to the skin or nipple, or any unusual discharge.\n\nClinical breast examinations by a healthcare professional are also important. Women over 40 should aim for a mammogram every one to two years. At Divine Netcare, our team can guide you through this process.\n\nRemember — early detection dramatically improves treatment outcomes. If you notice any changes, do not wait. Come in and see one of our doctors as soon as possible. We are here for you.`,
          coverImage:
            "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&h=600&fit=crop",
          createdAt: "2024-10-22",
          author: { firstName: "Abena", lastName: "Mensah" },
        }),
      )
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({ title: post.title, url: window.location.href })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded w-1/6" />
          <div className="h-10 bg-slate-200 rounded w-5/6" />
        </div>
        <div className="h-[400px] bg-slate-200 rounded-3xl w-full shadow-inner" />
        <div className="space-y-4 max-w-3xl mx-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-slate-100 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-32 max-w-md mx-auto px-4">
        <HeartPulse className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Resource Unavailable
        </h3>
        <p className="text-slate-500 text-sm mb-6">
          The medical article you are looking for does not exist or has been
          archived.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl shadow-sm hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen pb-24">
      {/* ── STICKY BACK/ACTION NAVIGATION ────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-bold tracking-tight transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />{" "}
            Back to Health Hub
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? "Link Copied!" : "Share Analysis"}
          </button>
        </div>
      </nav>

      {/* ── CENTRALIZED EDITORIAL GRID ───────────────────── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12">
        {/* Header Metadata */}
        <header className="space-y-4 mb-8 text-center sm:text-left">
          <span className="inline-flex items-center bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
            Verified Educational Resource
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider pt-2 border-b border-slate-100 pb-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />{" "}
              {formatDate(post.createdAt)}
            </span>
            {post.author && (
              <span className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Reviewed by Dr. {post.author.firstName} {post.author.lastName}
              </span>
            )}
          </div>
        </header>

        {/* Cinematic Cover Illustration */}
        <div className="relative h-[280px] sm:h-[420px] w-full rounded-3xl overflow-hidden shadow-md border border-slate-200/40 mb-12">
          <Image
            src={
              post.coverImage ||
              "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=600&fit=crop"
            }
            alt={post.title}
            fill
            className="object-cover brightness-95"
            priority
          />
        </div>

        {/* Editorial Body Segment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Copy Content */}
          <article className="lg:col-span-12 prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-600 prose-p:text-base sm:prose-p:text-lg">
            {post.content.split("\n\n").map((paragraph: string, i: number) => (
              <p key={i} className="mb-6 font-normal">
                {paragraph}
              </p>
            ))}

            {/* Premium Clinical Advisory Callout Box */}
            <div className="mt-10 bg-amber-50/50 border border-amber-200/60 rounded-2xl p-6 flex gap-4 items-start">
              <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-amber-900 font-bold text-sm uppercase tracking-wide">
                  Medical Disclaimer
                </h4>
                <p className="text-amber-800 text-xs sm:text-sm leading-relaxed m-0 font-medium">
                  This educational content is compiled strictly for preventative
                  health insights and does not replace dedicated on-site
                  laboratory evaluations or custom physician clinical
                  diagnostics.
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* ── CONTEXTUAL CLINICAL CTA PANEL ────────────────── */}
        <footer className="mt-16 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 rounded-3xl p-8 sm:p-10 text-center sm:text-left relative overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Require Standard Clinical Assistance?
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                Our board-certified specialist units at Divine Netcare Hospital
                are ready to evaluate your situation. Set up a diagnostic
                session instantly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <Link
                href="/appointments"
                className="w-full sm:w-auto text-center bg-white text-slate-950 hover:bg-slate-50 text-sm font-bold tracking-wide px-6 py-3.5 rounded-xl transition-all shadow-md"
              >
                Book Appointment
              </Link>
              <a
                href="tel:+233558484862"
                className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/10 hover:bg-white/20 text-sm font-bold tracking-wide px-5 py-3.5 rounded-xl transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-400" /> Call Direct Line
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
