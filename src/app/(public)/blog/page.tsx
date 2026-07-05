"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Calendar,
  ArrowRight,
  BookOpen,
  Sparkles,
  Clock,
} from "lucide-react";
import { postsAPI } from "@/lib/api";
import { formatDate, truncate } from "@/lib/utils";

const fallbackPosts = [
  {
    id: "1",
    title: "Breast Cancer Awareness: What Every Woman Should Know",
    content:
      "Early detection saves lives. Learn about the importance of regular breast screening and self-examination. Breast cancer is one of the most common cancers affecting women in Ghana and across Africa.",
    coverImage:
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=400&fit=crop",
    createdAt: "2024-10-22",
    author: { firstName: "Dr. Abena", lastName: "Mensah" },
  },
  {
    id: "2",
    title: "The Importance of Prenatal Care During Pregnancy",
    content:
      "Regular prenatal visits are crucial for both mother and baby. Our maternity team explains what to expect at each stage of your pregnancy journey.",
    coverImage:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop",
    createdAt: "2024-09-15",
    author: { firstName: "Dr. Kwame", lastName: "Asante" },
  },
  {
    id: "3",
    title: "Managing Diabetes in Ghana: Tips From Our Specialists",
    content:
      "Diabetes is increasingly common in Ghana. Our doctors share practical lifestyle and dietary advice to help you manage the condition effectively.",
    coverImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    createdAt: "2024-08-05",
    author: { firstName: "Dr. Kofi", lastName: "Boateng" },
  },
  {
    id: "4",
    title: "Eye Health: Protecting Your Vision in the Digital Age",
    content:
      "With increasing screen time, eye health is more important than ever. Our eye clinic specialists share tips for protecting your vision.",
    coverImage:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop",
    createdAt: "2024-07-20",
    author: { firstName: "Dr. Ama", lastName: "Owusu" },
  },
  {
    id: "5",
    title: "Malaria Prevention: Essential Tips for Families in Kumasi",
    content:
      "Malaria remains a major health challenge in Ghana. Learn how to protect your family with proven prevention strategies.",
    coverImage:
      "https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=600&h=400&fit=crop",
    createdAt: "2024-06-10",
    author: { firstName: "Dr. Kwame", lastName: "Asante" },
  },
  {
    id: "6",
    title: "Child Nutrition: Building Healthy Habits From Birth",
    content:
      "Good nutrition in the early years sets the foundation for lifelong health. Our paediatric team offers guidance for parents.",
    coverImage:
      "https://images.unsplash.com/photo-1489367874814-848bf5108ae4?w=600&h=400&fit=crop",
    createdAt: "2024-05-18",
    author: { firstName: "Dr. Abena", lastName: "Mensah" },
  },
];

const categories = [
  "All",
  "Women's Health",
  "Maternity",
  "General Health",
  "Eye Care",
  "Nutrition",
  "Emergency",
];

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    postsAPI
      .getPublished()
      .then((res) => {
        const data = res?.data?.data || [];
        setPosts(data.length > 0 ? data : fallbackPosts);
      })
      .catch(() => setPosts(fallbackPosts))
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen">
      {/* ── MODERN BANNER HERO ──────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950 py-24 px-4 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-emerald-300 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 fill-current" /> Clinical Insights
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none">
            Health & Wellness Blog
          </h1>
          <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Expert health documentation, preventative strategies, and standard
            wellness guides authored directly by medical officers.
          </p>

          {/* Enhanced Search Input */}
          <div className="max-w-md mx-auto relative pt-4">
            <Search className="absolute left-4 top-1/2 translate-y-0.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search health resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all text-base shadow-xl border border-slate-200/20"
            />
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE CATEGORY CAROUSEL ────────────────── */}
      <section className="py-5 bg-white border-b border-slate-200/60 shadow-sm sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto scrollbar-none items-center">
          <span className="text-slate-400 font-bold text-[10px] tracking-wider uppercase mr-2 hidden md:inline-block">
            Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── BLOG INSIGHTS GRID ───────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm animate-pulse space-y-4"
              >
                <div className="h-48 bg-slate-200 w-full" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-6 bg-slate-200 rounded w-5/6" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200/60 rounded-3xl p-8 max-w-md mx-auto shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4 stroke-[1.5]" />
            <p className="text-slate-500 font-medium text-lg">
              No medical articles match your query.
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-emerald-600 text-sm font-semibold hover:underline"
            >
              Clear search input
            </button>
          </div>
        ) : (
          <>
            {/* FEATURED RECORD ARTICLE */}
            {featured && (
              <div className="mb-16">
                <Link
                  href={`/blog/${featured.id}`}
                  className="group grid grid-cols-1 lg:grid-cols-12 bg-white border border-slate-200/60 hover:border-slate-300/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="relative h-64 lg:h-full min-h-[350px] lg:col-span-7 bg-slate-100 overflow-hidden">
                    <Image
                      src={
                        featured.coverImage ||
                        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop"
                      }
                      alt={featured.title}
                      fill
                      priority
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-700 brightness-95"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-emerald-600 text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Featured Resource
                      </span>
                    </div>
                  </div>

                  <div className="p-8 lg:p-12 lg:col-span-5 flex flex-col justify-center bg-white">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {formatDate(featured.createdAt)}
                    </div>

                    <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors leading-tight tracking-tight">
                      {featured.title}
                    </h2>

                    <p className="text-slate-500 leading-relaxed text-sm sm:text-base mb-6 font-normal">
                      {truncate(featured.content, 180)}
                    </p>

                    {featured.author && (
                      <div className="border-t border-slate-100 pt-4 mb-6 flex items-center">
                        <p className="text-xs text-slate-400 font-medium">
                          Medical Review by{" "}
                          <span className="text-slate-900 font-semibold">
                            Dr. {featured.author.firstName}{" "}
                            {featured.author.lastName}
                          </span>
                        </p>
                      </div>
                    )}

                    <div className="inline-flex items-center gap-2 text-slate-900 group-hover:text-emerald-600 font-bold text-sm tracking-wide transition-colors">
                      Read Full Analysis{" "}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* SECONDARY STANDARD FEED GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="bg-white border border-slate-200/60 hover:border-slate-300/80 rounded-3xl overflow-hidden group transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-52 bg-slate-100 overflow-hidden">
                      <Image
                        src={
                          post.coverImage ||
                          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop"
                        }
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500 brightness-95"
                      />
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.createdAt)}
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-lg leading-snug group-hover:text-emerald-700 transition-colors tracking-tight">
                        {post.title}
                      </h3>

                      <p className="text-slate-500 text-sm leading-relaxed font-normal line-clamp-2">
                        {truncate(post.content, 120)}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 border-t border-slate-50 mt-auto flex items-center justify-between">
                    {post.author ? (
                      <p className="text-[11px] text-slate-400 font-medium">
                        By{" "}
                        <span className="text-slate-700 font-semibold">
                          Dr. {post.author.firstName} {post.author.lastName}
                        </span>
                      </p>
                    ) : (
                      <div />
                    )}
                    <span className="text-slate-900 group-hover:text-emerald-600 text-xs font-bold flex items-center gap-1">
                      Read{" "}
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
