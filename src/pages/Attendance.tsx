import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, FileText, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { attendanceService } from "@/api/services";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { ExportDialog, ExportFilters } from "@/components/common/ExportDialog";
import { exportToExcel, formatDateRange } from "@/lib/export-utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedEmployee, setSelectedEmployee] = useState<string | undefined>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  
  // Fetch attendance data
  const { data: attendanceData = [] } = useQuery({
    queryKey: ["attendance"],
    queryFn: () => attendanceService.getAllAttendance(),
  });

  // Fetch employee list for filtering
  const { data: employees = [] } = useQuery({
    queryKey: ["employees_minimal"],
    queryFn: () => attendanceService.getEmployeeList(),
  });

  // Get unique departments and designations for export filters
  const departments = Array.from(
    new Set(attendanceData.map((record) => record.department))
  );
  
  const designations = Array.from(
    new Set(attendanceData.map((record) => record.designation))
  );

  // Filter attendance data based on search, date range and employee
  const filteredAttendance = attendanceData.filter((record) => {
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.designation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDateRange = dateRange
      ? (!dateRange.from || new Date(record.date) >= dateRange.from) && 
        (!dateRange.to || new Date(record.date) <= dateRange.to)
      : true;
      
    const matchesEmployee =
      selectedEmployee && selectedEmployee !== "all"
        ? record.employeeId === selectedEmployee
        : true;
    
    return matchesSearch && matchesDateRange && matchesEmployee;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredAttendance.length / ITEMS_PER_PAGE));
  const paginatedAttendance = filteredAttendance.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleExport = (filters: ExportFilters) => {
    // Filter data according to export filters
    const dataToExport = attendanceData.filter((record) => {
      const matchesDateRange = filters.dateRange
        ? (!filters.dateRange.from || new Date(record.date) >= filters.dateRange.from) && 
          (!filters.dateRange.to || new Date(record.date) <= filters.dateRange.to)
        : true;
        
      const matchesDepartment = filters.department
        ? record.department === filters.department
        : true;
        
      const matchesDesignation = filters.designation
        ? record.designation === filters.designation
        : true;
      
      return matchesDateRange && matchesDepartment && matchesDesignation;
    });

    // Define headers and row mapping for Excel export
    const headers = [
      "Employee", "Department", "Designation", "Date", 
      "In Time", "In Location", "Out Time", "Out Location", 
      "Working Hours", "Status"
    ];
    
    const rowMapper = (record: typeof attendanceData[0]) => [
      record.employeeName,
      record.department,
      record.designation,
      format(new Date(record.date), "MMM dd, yyyy"),
      record.checkIn || "-",
      record.inLocation || "-",
      record.checkOut || "-",
      record.outLocation || "-",
      record.workingHours || "00:00:00",
      record.status.charAt(0).toUpperCase() + record.status.slice(1)
    ];

    // Generate filename with date range
    const dateInfo = formatDateRange(filters.dateRange);
    const filename = `attendance_report_${dateInfo}`;
    
    // Export to Excel
    exportToExcel(dataToExport, headers, rowMapper, filename);
  };

  // Legacy CSV export (keeping for backward compatibility)
  const handleLegacyExport = (type: string) => {
    const filename = `attendance_report_${format(new Date(), 'yyyy-MM-dd')}`;
    
    if (type === "CSV") {
      // Mock CSV export
      const headers = [
        "Employee", "Department", "Designation", "Date", 
        "In Time", "In Location", "Out Time", "Out Location", 
        "Working Hours", "Status"
      ];
      
      const csvData = filteredAttendance.map(record => [
        record.employeeName,
        record.department,
        record.designation,
        format(new Date(record.date), "MMM dd, yyyy"),
        record.checkIn || "-",
        record.inLocation || "-",
        record.checkOut || "-",
        record.outLocation || "-",
        record.workingHours || "00:00:00",
        record.status
      ]);
      
      downloadCSV([headers, ...csvData], filename);
      toast.success(`Exported ${filteredAttendance.length} records as CSV`);
    } else if (type === "PDF") {
      // Mock PDF export
      toast.success(`Exporting ${filteredAttendance.length} records as PDF. This would download a PDF in a real implementation.`);
    }
  };
  
  // Helper function to download CSV
  const downloadCSV = (data: any[][], filename: string) => {
    const csvContent = data.map(row => row.map(cell => 
      typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
    ).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Attendance Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-10"
                placeholder="Search by name, department, designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex w-full sm:w-auto items-center gap-3">
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                className="w-full sm:w-[280px]"
              />
              
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All employees</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto"
              onClick={() => setIsExportDialogOpen(true)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>In Time</TableHead>
                <TableHead>In Location</TableHead>
                <TableHead>Out Time</TableHead>
                <TableHead>Out Location</TableHead>
                <TableHead>Working Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAttendance.length > 0 ? (
                paginatedAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.employeeName}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.designation}</TableCell>
                    <TableCell>{format(new Date(record.date), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{record.checkIn || "-"}</TableCell>
                    <TableCell>{record.inLocation || "-"}</TableCell>
                    <TableCell>{record.checkOut || "-"}</TableCell>
                    <TableCell>{record.outLocation || "-"}</TableCell>
                    <TableCell>{record.workingHours || "00:00:00"}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        record.status === "present" && "bg-green-100 text-green-800",
                        record.status === "late" && "bg-yellow-100 text-yellow-800",
                        record.status === "absent" && "bg-red-100 text-red-800",
                        record.status === "half-day" && "bg-blue-100 text-blue-800"
                      )}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-6 text-gray-500">
                    No attendance records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="py-4 px-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                  // Show pagination logic: show first, last, and pages around current
                  let pageNum = index + 1;
                  if (totalPages > 5) {
                    if (currentPage <= 3) {
                      pageNum = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + index;
                    } else {
                      pageNum = currentPage - 2 + index;
                    }
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={currentPage === pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Export Dialog */}
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={handleExport}
        departments={departments}
        designations={designations}
        title="Export Attendance Data"
      />
    </MainLayout>
  );
};

export default Attendance;
