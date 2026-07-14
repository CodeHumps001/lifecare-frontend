"use client";

import { useState } from "react";
import { Wand2, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CalendarView } from "./CalendarView";
import { StaffGroupsManager } from "./StaffGroupsManager";
import { useShifts } from "../hooks/useShifts";
import { MONTHS } from "../hooks/contants";
import { clear } from "console";

interface ScheduleTabProps {
  departmentId: string;
}

export function ScheduleTab({ departmentId }: ScheduleTabProps) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [staffGroups, setStaffGroups] = useState<{
    morning: string[];
    night: string[];
    rotating: string[];
  }>({ morning: [], night: [], rotating: [] });

  const { shifts, deptStaff, loading, loadData, generateShifts } =
    useShifts(departmentId);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const hasGroups =
        staffGroups.morning.length > 0 ||
        staffGroups.night.length > 0 ||
        staffGroups.rotating.length > 0;

      const result = await generateShifts(
        month,
        year,
        hasGroups ? staffGroups : undefined,
      );
      toast.success(result.message);
    } catch (err) {
      // Error already handled in useShifts
    } finally {
      setGenerating(false);
    }
  };

  const handleGroupChange = (userId: string, group: string | null) => {
    if (!group) {
      setStaffGroups((prev) => ({
        morning: prev.morning.filter((id) => id !== userId),
        night: prev.night.filter((id) => id !== userId),
        rotating: prev.rotating.filter((id) => id !== userId),
      }));
      return;
    }
    setStaffGroups((prev) => {
      const cleaned = {
        morning: prev.morning.filter((id) => id !== userId),
        night: prev.night.filter((id) => id !== userId),
        rotating: prev.rotating.filter((id) => id !== userId),
      };
      if (group === "morning") cleaned.morning.push(userId);
      else if (group === "night") cleaned.night.push(userId);
      else if (group === "rotating") cleaned.rotating.push(userId);
      return cleaned;
    });
  };

  // 🔥 PDF Timetable Generation Feature
  const handleExportPDF = async () => {
    if (deptStaff.length === 0) {
      toast.error("No staff members to display in the schedule.");
      return;
    }

    setExporting(true);
    try {
      // Dynamically load to prevent Next.js SSR build issues
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const monthName = MONTHS[month - 1];

      // Document Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(31, 41, 55); // Gray-800
      doc.text(
        `DEPARTMENT TIMETABLE — ${monthName.toUpperCase()} ${year}`,
        14,
        15,
      );

      // Metadata Info
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128); // Gray-500
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()}  |  Total Staff: ${deptStaff.length}`,
        14,
        20,
      );

      // Total days in the chosen month
      const daysInMonth = new Date(year, month, 0).getDate();

      // Table Header definitions
      const headers = ["Staff Member"];
      for (let d = 1; d <= daysInMonth; d++) {
        headers.push(String(d));
      }

      // Populate schedule table rows
      const rows = deptStaff.map((staff) => {
        const rowData: string[] = [`${staff.firstName} ${staff.lastName}`];

        for (let d = 1; d <= daysInMonth; d++) {
          const targetDate = new Date(year, month - 1, d);

          // Find shift assignment for this user on this exact calendar day
          const shift = shifts.find((s) => {
            const sDate = new Date(s.date);
            return (
              sDate.getFullYear() === targetDate.getFullYear() &&
              sDate.getMonth() === targetDate.getMonth() &&
              sDate.getDate() === targetDate.getDate() &&
              s.userId === staff.id
            );
          });

          if (shift && shift.shiftType) {
            const name = shift.shiftType.name.toLowerCase();
            const isOff =
              shift.shiftType.isDayOff || name === "off" || name === "day off";

            if (isOff) {
              rowData.push("Off");
            } else {
              // Create shortcodes for clean timetable representation
              if (name.includes("morning")) rowData.push("M");
              else if (name.includes("night")) rowData.push("N");
              else if (name.includes("afternoon")) rowData.push("A");
              else if (name.includes("day")) rowData.push("D");
              else
                rowData.push(
                  shift.shiftType.name.substring(0, 2).toUpperCase(),
                );
            }
          } else {
            rowData.push("—");
          }
        }
        return rowData;
      });

      // Render the Landscape Grid
      autoTable(doc, {
        startY: 25,
        head: [headers],
        body: rows,
        theme: "grid",
        styles: {
          fontSize: 7,
          cellPadding: 1.2,
          halign: "center",
          valign: "middle",
          font: "helvetica",
          lineColor: [229, 231, 235], // Gray-200 border
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [37, 99, 235], // Classic Blue Theme
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8,
        },
        columnStyles: {
          0: { halign: "left", fontStyle: "bold", cellWidth: 38 }, // Name column gets extra width
        },
        didParseCell: (data) => {
          // Color code cells dynamically based on shifts (syncs with SHIFT_COLORS in CalendarView.tsx)
          if (data.row.section === "body" && data.column.index > 0) {
            const val = data.cell.text[0];
            if (val === "M") {
              data.cell.styles.fillColor = [254, 243, 199]; // Amber-100
              data.cell.styles.textColor = [180, 83, 9]; // Amber-700
            } else if (val === "N") {
              data.cell.styles.fillColor = [224, 231, 255]; // Indigo-100
              data.cell.styles.textColor = [67, 56, 202]; // Indigo-700
            } else if (val === "D") {
              data.cell.styles.fillColor = [219, 234, 254]; // Blue-100
              data.cell.styles.textColor = [29, 78, 216]; // Blue-700
            } else if (val === "A") {
              data.cell.styles.fillColor = [255, 237, 213]; // Orange-100
              data.cell.styles.textColor = [194, 65, 12]; // Orange-700
            } else if (val === "Off" || val === "—") {
              data.cell.styles.fillColor = [249, 250, 251]; // Gray-50
              data.cell.styles.textColor = [156, 163, 175]; // Gray-400
            }
          }
        },
      });

      // Add Footer Legend
      const finalY = (doc as any).lastAutoTable.finalY || 160;
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175); // Gray-400
      doc.text(
        "Legend:  M = Morning  |  N = Night  |  D = Day  |  A = Afternoon  |  Off = Day Off",
        14,
        finalY + 10,
      );

      doc.save(`Schedule_${monthName}_${year}.pdf`);
      toast.success("Timetable exported successfully!");
    } catch (err) {
      console.error("PDF Export error:", err);
      toast.error("An error occurred while generating the PDF.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-6">
          <div className="space-y-2">
            <Label>Month</Label>
            <Select
              value={String(month)}
              onValueChange={(value) =>
                value !== null && setMonth(Number(value))
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={m} value={String(i + 1)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Input
              type="number"
              className="w-28"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>
          <ConfirmDialog
            trigger={
              <Button disabled={generating} className="gap-2">
                <Wand2 className="h-4 w-4" />
                {generating ? "Generating…" : "Generate Schedule"}
              </Button>
            }
            title="Generate this month's schedule?"
            description="This will generate the schedule for the selected department and month using the configured shift cycle."
            confirmLabel="Generate"
            destructive={false}
            onConfirm={handleGenerate}
          />
          <Button variant="outline" onClick={loadData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          {/* Export Timetable Button */}
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={exporting || loading}
            className="gap-2 ml-auto border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Download className="h-4 w-4" />
            {exporting ? "Exporting..." : "Export PDF Timetable"}
          </Button>
        </CardContent>
      </Card>

      {/* Staff Groups */}
      {deptStaff.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <StaffGroupsManager
              staff={deptStaff}
              staffGroups={staffGroups}
              onGroupChange={handleGroupChange}
            />
          </CardContent>
        </Card>
      )}

      {/* Calendar View */}
      <CalendarView
        shifts={shifts}
        deptStaff={deptStaff}
        loading={loading}
        month={month}
        year={year}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
    </div>
  );
}
