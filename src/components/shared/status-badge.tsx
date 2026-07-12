import { Badge } from "@/components/ui/badge";
import { cn, titleCase } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  // positive
  APPROVED: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  CONFIRMED: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  COMPLETED: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  PRESENT: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  SHORTLISTED: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  ACTIVE: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  PUBLISHED: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  OPEN: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  // neutral / pending
  PENDING: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  REVIEWED: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  LATE: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  DRAFT: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  CLOSED: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  // negative
  REJECTED: "bg-rose-100 text-rose-700 hover:bg-rose-100",
  CANCELLED: "bg-rose-100 text-rose-700 hover:bg-rose-100",
  ABSENT: "bg-rose-100 text-rose-700 hover:bg-rose-100",
  INACTIVE: "bg-rose-100 text-rose-700 hover:bg-rose-100",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={cn("border-0 font-medium", STATUS_STYLES[status] ?? "bg-slate-100 text-slate-700")}>
      {titleCase(status)}
    </Badge>
  );
}
