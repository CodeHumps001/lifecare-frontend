// app/admin/shifts/components/ShiftTypeDialog.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { shiftTypesApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import type { ShiftType } from "@/lib/types";

interface ShiftTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentId: string;
  editing: ShiftType | null;
  onSuccess: () => void;
}

const emptyForm = {
  name: "",
  startTime: "08:00",
  endTime: "16:00",
  isDayOff: false,
};

export function ShiftTypeDialog({
  open,
  onOpenChange,
  departmentId,
  editing,
  onSuccess,
}: ShiftTypeDialogProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name || (!form.isDayOff && (!form.startTime || !form.endTime))) {
      toast.error("Name and time are required");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, departmentId };
      if (editing) {
        await shiftTypesApi.update(editing.id, payload);
        toast.success("Shift type updated");
      } else {
        await shiftTypesApi.create(payload);
        toast.success("Shift type created");
      }
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to save shift type",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Shift Type" : "New Shift Type"}
          </DialogTitle>
          <DialogDescription>
            Shift types feed the auto-scheduler — name morning/night/off shifts
            consistently.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Night, Morning, Full Day, Off"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start time</Label>
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
                disabled={form.isDayOff}
              />
            </div>
            <div className="space-y-2">
              <Label>End time</Label>
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                disabled={form.isDayOff}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isDayOff"
              checked={form.isDayOff}
              onCheckedChange={(v) =>
                setForm({ ...form, isDayOff: Boolean(v) })
              }
            />
            <Label htmlFor="isDayOff" className="cursor-pointer font-normal">
              This is a day-off slot (not a working shift)
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
