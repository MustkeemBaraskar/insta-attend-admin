
import * as React from "react";
import { format } from "date-fns";
import { Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (filters: ExportFilters) => void;
  departments: string[];
  designations: string[];
  title: string;
}

export interface ExportFilters {
  dateRange?: DateRange;
  department?: string;
  designation?: string;
}

export function ExportDialog({
  isOpen,
  onClose,
  onExport,
  departments,
  designations,
  title,
}: ExportDialogProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [department, setDepartment] = React.useState<string>("all");
  const [designation, setDesignation] = React.useState<string>("all");

  const handleExport = () => {
    onExport({
      dateRange,
      department: department !== "all" ? department : undefined,
      designation: designation !== "all" ? designation : undefined,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="date-range" className="text-sm font-medium">
              Date Range
            </label>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Select date range"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="department" className="text-sm font-medium">
              Department
            </label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="designation" className="text-sm font-medium">
              Designation
            </label>
            <Select value={designation} onValueChange={setDesignation}>
              <SelectTrigger>
                <SelectValue placeholder="Select designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Designations</SelectItem>
                {designations.map((desig) => (
                  <SelectItem key={desig} value={desig}>
                    {desig}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Download Excel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
