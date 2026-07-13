// app/admin/shifts/hooks/useShifts.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { shiftsApi, usersApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import type { Shift, User } from "@/lib/types";

export function useShifts(departmentId: string) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [deptStaff, setDeptStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!departmentId) return;
    setLoading(true);
    try {
      const [shiftsData, staffData] = await Promise.all([
        shiftsApi.byDepartment(departmentId),
        usersApi.list(),
      ]);
      setShifts(shiftsData);
      const staff = staffData.filter(
        (s: User) => s.departmentId === departmentId && s.isActive,
      );
      setDeptStaff(staff);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to load data",
      );
    } finally {
      setLoading(false);
    }
  };

  const generateShifts = async (
    month: number,
    year: number,
    staffGroups?: { morning: string[]; night: string[]; rotating: string[] },
  ) => {
    try {
      const payload: any = {
        departmentId,
        month,
        year,
        mode: "auto",
      };

      // 🔥 FIX: Include staffGroups in the payload
      if (staffGroups) {
        payload.staffGroups = staffGroups;
      }

      console.log("📤 Sending to backend:", payload);

      const result = await shiftsApi.generate(payload);
      return result;
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to generate schedule",
      );
      throw err;
    }
  };

  useEffect(() => {
    if (departmentId) {
      loadData();
    }
  }, [departmentId]);

  return {
    shifts,
    deptStaff,
    loading,
    loadData,
    generateShifts,
  };
}
