
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

export function exportToExcel<T>(
  data: T[],
  headers: string[],
  rowMapper: (item: T) => any[],
  filename: string
): void {
  try {
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data.map(rowMapper)]);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    
    // Save file
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${filename}.xlsx`);
    
    toast.success(`Successfully exported ${data.length} records to Excel`);
  } catch (error) {
    console.error("Excel export error:", error);
    toast.error("Failed to export data to Excel");
  }
}

export function formatDateRange(dateRange?: DateRange): string {
  if (!dateRange) return "All Dates";
  if (!dateRange.from) return "All Dates";
  if (!dateRange.to) return format(dateRange.from, "MMM dd, yyyy");
  return `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`;
}
