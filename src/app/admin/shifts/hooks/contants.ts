// app/admin/shifts/constants.ts
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const SHIFT_COLORS: Record<string, string> = {
  Morning: "bg-amber-100 text-amber-700 border-amber-200",
  Night: "bg-indigo-100 text-indigo-700 border-indigo-200",
  Day: "bg-blue-100 text-blue-700 border-blue-200",
  "Full Day": "bg-purple-100 text-purple-700 border-purple-200",
  Afternoon: "bg-orange-100 text-orange-700 border-orange-200",
  off: "bg-gray-100 text-gray-400 border-gray-200",
  "Day Off": "bg-gray-100 text-gray-400 border-gray-200",
};
