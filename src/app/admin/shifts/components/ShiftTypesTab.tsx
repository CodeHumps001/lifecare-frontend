// app/admin/shifts/components/ShiftTypesTab.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
// import { ShiftTypeDialog } from "./ShiftTypeDialog";
import { shiftTypesApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import type { ShiftType } from "@/lib/types";
import { ShiftTypeDialog } from "./ShiftTypeDialog";

interface ShiftTypesTabProps {
  departmentId: string;
}

export function ShiftTypesTab({ departmentId }: ShiftTypesTabProps) {
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ShiftType | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await shiftTypesApi.listByDepartment(departmentId);
      setShiftTypes(data);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to load shift types",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [departmentId]);

  const handleDelete = async (id: string) => {
    try {
      await shiftTypesApi.remove(id);
      toast.success("Shift type deleted");
      load();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to delete shift type",
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Shift Type
        </Button>
      </div>

      <ShiftTypeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        departmentId={departmentId}
        editing={editing}
        onSuccess={load}
      />

      <Card>
        <CardHeader>
          <CardTitle>
            Shift Types
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({shiftTypes.length} types)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : shiftTypes.length === 0 ? (
            <EmptyState
              title="No shift types yet"
              description="Add shift types like Morning, Night, and Off before generating a schedule."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shiftTypes.map((st) => (
                  <TableRow key={st.id}>
                    <TableCell className="font-medium">{st.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {st.isDayOff ? "—" : `${st.startTime} – ${st.endTime}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant={st.isDayOff ? "secondary" : "default"}>
                        {st.isDayOff ? "Day Off" : "Working"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditing(st);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        }
                        title={`Delete ${st.name}?`}
                        description="This cannot be undone."
                        confirmLabel="Delete"
                        onConfirm={() => handleDelete(st.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
