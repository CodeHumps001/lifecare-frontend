"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Star, Check, X } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { reviewsApi, ApiError } from "@/lib/api";
import type { Review } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      // NOTE: the public /reviews endpoint only returns APPROVED reviews, so
      // moderation uses /reviews/all — see backend-additions for the required patch.
      const all = await reviewsApi.listAll();
      setReviews(
        [...all].sort((a, b) => {
          if (a.status === "PENDING" && b.status !== "PENDING") return -1;
          if (a.status !== "PENDING" && b.status === "PENDING") return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }),
      );
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpdate = async (id: string, status: "APPROVED" | "REJECTED") => {
    setUpdatingId(id);
    try {
      await reviewsApi.updateStatus(id, status);
      toast.success(`Review ${status.toLowerCase()}`);
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update review");
    } finally {
      setUpdatingId(null);
    }
  };

  const StarRow = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn("h-3.5 w-3.5", i <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")}
        />
      ))}
    </div>
  );

  return (
    <div>
      <PageHeader title="Reviews" description="Moderate patient reviews submitted from the public website." />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews yet" description="Patient reviews will appear here for moderation." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-5">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <p className="font-medium">{r.name}</p>
                    <StarRow rating={r.rating} />
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{r.comment}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</p>
                  {r.status === "PENDING" && (
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={updatingId === r.id}
                        onClick={() => handleUpdate(r.id, "APPROVED")}
                      >
                        <Check className="h-4 w-4 text-emerald-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={updatingId === r.id}
                        onClick={() => handleUpdate(r.id, "REJECTED")}
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
