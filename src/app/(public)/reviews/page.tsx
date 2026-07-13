"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Star,
  CheckCircle,
  Quote,
  AlertCircle,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { reviewsApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";

const fallbackReviews = [
  {
    id: "1",
    name: "Nana Yaw",
    rating: 5,
    comment:
      "Very nice hospital, the nurses are good, very respectful, caring. I will advise you to go there whenever you are feeling unwell.",
    createdAt: "2021-03-15",
  },
  {
    id: "2",
    name: "Appiah Holiness",
    rating: 5,
    comment:
      "Best place for pregnant women to deliver. The maternity team is exceptional and very professional.",
    createdAt: "2023-06-10",
  },
  {
    id: "3",
    name: "Selase Kokuma",
    rating: 5,
    comment:
      "Quality health care delivery, great customer service. The staff made me feel at home throughout my treatment.",
    createdAt: "2019-11-20",
  },
  {
    id: "4",
    name: "Felix Antwi",
    rating: 5,
    comment:
      "Our Care Is DeVine. Great customer service and professional staff who take their work seriously.",
    createdAt: "2020-08-05",
  },
];

function StarRating({
  rating,
  onRate,
}: {
  rating: number;
  onRate?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={onRate ? "button" : undefined}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => onRate && setHovered(star)}
          onMouseLeave={() => onRate && setHovered(0)}
          className={
            onRate
              ? "cursor-pointer focus:outline-none scale-100 hover:scale-110 transition-transform"
              : "cursor-default"
          }
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              star <= (hovered || rating)
                ? "text-amber-400 fill-amber-400"
                : "text-slate-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    name: string;
    email: string;
    comment: string;
  }>();

  useEffect(() => {
    reviewsApi
      .listApproved()
      .then((data) => {
        // reviewsApi.listApproved() returns Review[] directly
        setReviews(data.length > 0 ? data : fallbackReviews);
      })
      .catch(() => setReviews(fallbackReviews))
      .finally(() => setLoading(false));
  }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  const onSubmit = async (data: any) => {
    if (rating === 0) {
      setError("Please select a star rating parameter.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      // Use direct fetch since reviewsApi doesn't have a submit method
      const BASE_URL =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
      const response = await fetch(`${BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, rating }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit review");
      }

      setSubmitted(true);
      reset();
      setRating(0);
    } catch (err: any) {
      setError(err.message || "Failed to submit operational review packet.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen pb-24">
      {/* ── HIGH-END HERO HEADER MODULE ────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950 overflow-hidden border-b border-slate-900 px-4 py-20 text-center">
        <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="max-w-3xl mx-auto space-y-6 relative z-20">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-md border border-emerald-500/20 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Patient
            Voice Matrix
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none">
            Verified Patient <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-emerald-400">
              Clinical Experiences
            </span>
          </h1>

          <div className="inline-flex flex-col items-center bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl shadow-xl space-y-2 mt-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-6 h-6 text-amber-400 fill-amber-400"
                />
              ))}
            </div>
            <p className="text-slate-200 text-sm font-bold tracking-wide uppercase">
              {avgRating} Out of 5 Stars{" "}
              <span className="text-slate-400 font-normal px-1">|</span> based
              on {reviews.length} Patient Reviews
            </p>
          </div>
        </div>
      </section>

      {/* ── REVIEWS MESH GRID ──────────────────────────────────── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm space-y-4 animate-pulse"
              >
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                </div>
                <div className="h-10 bg-slate-100 rounded-xl w-1/2 mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6 relative overflow-hidden group"
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <Quote className="w-8 h-8 text-emerald-500/10 fill-emerald-500/5 stroke-emerald-600/20" />
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed italic">
                    &quot;{review.comment}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 relative z-10">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 rounded-xl flex items-center justify-center font-bold text-xs shadow-md shrink-0">
                    {review.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-slate-950 text-xs tracking-tight truncate">
                      {review.name}
                    </p>
                    <p className="text-slate-400 text-[11px] font-normal">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── INTERACTIVE REVIEW SUBMISSION STREAM ────────────────── */}
      <section className="py-12 px-4 max-w-3xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs tracking-wider uppercase">
            <Heart className="w-3.5 h-3.5 fill-emerald-100" /> Share Your
            Experience
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Leave An Operational Review
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-normal max-w-md mx-auto leading-relaxed">
            Your feedback updates our service matrix and provides crucial health
            decision matrices for alternative local patients.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white border border-slate-200/60 rounded-3xl p-10 text-center shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-600" />
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-inner animate-bounce">
              <CheckCircle className="w-8 h-8 stroke-[1.75]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight">
                Submission Transmitted
              </h3>
              <p className="text-slate-500 text-sm font-normal max-w-sm mx-auto leading-relaxed">
                Thank you for the verification data. Your entry has been logged
                and will pass through moderation before deployment onto the
                verified public timeline.
              </p>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="inline-flex items-center justify-center bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs tracking-wider uppercase px-5 py-3.5 rounded-xl shadow-sm transition-colors"
            >
              Write Another Entry
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5"
          >
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                Your Rating Scale <span className="text-red-500">*</span>
              </label>
              <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl inline-block">
                <StarRating rating={rating} onRate={setRating} />
              </div>
              {error && error.includes("rating") && (
                <p className="text-red-600 text-xs font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Selection Matrix
                  Required
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name", {
                    required: "Name configuration parameter is mandatory",
                  })}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="text-red-600 text-xs font-semibold">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Email Vector{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                Detailed Feedback Review <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("comment", {
                  required: "Review body context is required",
                  minLength: {
                    value: 20,
                    message:
                      "Please supply a description of at least 20 characters",
                  },
                })}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all resize-none h-32"
                placeholder="Share clean details regarding your diagnostic treatment experience..."
              />
              {errors.comment && (
                <p className="text-red-600 text-xs font-semibold">
                  {errors.comment.message}
                </p>
              )}
            </div>

            {error && !error.includes("rating") && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-100 rounded-xl p-3.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="text-xs font-semibold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-slate-950 text-white hover:bg-slate-800 disabled:bg-slate-400 font-bold text-xs tracking-wider uppercase py-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              {submitting
                ? "Processing Matrix Packet..."
                : "Dispatch Secure Review"}
            </button>
            <p className="text-slate-400 text-[10px] text-center font-normal">
              All submitted data sets pass through internal screening buffers
              prior to structural publication.
            </p>
          </form>
        )}
      </section>
    </div>
  );
}
