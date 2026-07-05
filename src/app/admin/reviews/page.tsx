"use client";
import { useEffect, useState } from "react";
import { Star, CheckCircle, XCircle, Clock, Quote } from "lucide-react";
import { reviewsAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    reviewsAPI.getApproved()
      .then(res => setReviews(res.data.data))
      .catch(() => setReviews([
        { id: "1", name: "Nana Yaw", email: "nana@gmail.com", rating: 5, comment: "Very nice hospital, the nurses are good, very respectful.", status: "APPROVED", createdAt: "2024-03-15" },
        { id: "2", name: "Appiah H", email: "appiah@gmail.com", rating: 5, comment: "Best place for pregnant women to deliver.", status: "PENDING", createdAt: "2024-06-10" },
      ]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleUpdate = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await reviewsAPI.updateStatus(id, status);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(null);
    }
  };

  const pending = reviews.filter(r => r.status === "PENDING");
  const approved = reviews.filter(r => r.status === "APPROVED");

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-dark">Patient Reviews</h1>
        <p className="text-gray-400 text-sm mt-1">Moderate patient reviews before they appear publicly</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending", value: pending.length, color: "bg-amber-100 text-amber-700", icon: Clock },
          { label: "Approved", value: approved.length, color: "bg-green-100 text-green-700", icon: CheckCircle },
          { label: "Total", value: reviews.length, color: "bg-blue-100 text-blue-700", icon: Star },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-card p-5">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="font-display font-bold text-2xl text-brand-dark">{s.value}</div>
            <div className="text-gray-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pending reviews */}
      {pending.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-lg text-brand-dark mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" /> Pending Moderation ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map(review => (
              <div key={review.id} className="bg-white rounded-2xl shadow-card p-6 border-l-4 border-amber-400">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Quote className="w-6 h-6 text-gray-200 fill-gray-100 mb-2" />
                    <p className="text-gray-600 italic mb-4">"{review.comment}"</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {review.name.slice(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-brand-dark">{review.name}</p>
                          <p className="text-gray-400 text-xs">{review.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`w-4 h-4 ${i <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                        ))}
                      </div>
                      <span className="text-gray-400 text-xs">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleUpdate(review.id, "APPROVED")}
                      disabled={updating === review.id}
                      className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleUpdate(review.id, "REJECTED")}
                      disabled={updating === review.id}
                      className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved reviews */}
      <div>
        <h2 className="font-display font-bold text-lg text-brand-dark mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" /> Approved Reviews ({approved.length})
        </h2>
        {loading ? (
          <div className="space-y-4">
            {[1,2].map(i => <div key={i} className="h-32 skeleton rounded-2xl animate-pulse" />)}
          </div>
        ) : approved.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-8 text-center">
            <Star className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No approved reviews yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approved.map(review => (
              <div key={review.id} className="bg-white rounded-2xl shadow-card p-5">
                <Quote className="w-5 h-5 text-gray-200 fill-gray-100 mb-2" />
                <p className="text-gray-600 text-sm italic mb-3">"{review.comment}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {review.name.slice(0,2).toUpperCase()}
                    </div>
                    <p className="text-sm font-semibold text-brand-dark">{review.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`w-3 h-3 ${i <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                      ))}
                    </div>
                    <button
                      onClick={() => handleUpdate(review.id, "REJECTED")}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
