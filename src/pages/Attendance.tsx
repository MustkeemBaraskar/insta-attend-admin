
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Filter, FileText, Download } from "lucide-react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
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

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string | undefined>();

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

  // Filter attendance data based on search, date and employee
  const filteredAttendance = attendanceData.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate ? record.date === format(selectedDate, "yyyy-MM-dd") : true;
    const matchesEmployee = selectedEmployee && selectedEmployee !== "all" ? record.employeeId === selectedEmployee : true;
    return matchesSearch && matchesDate && matchesEmployee;
  });

  const handleExport = (type: string) => {
    const filename = `attendance_report_${format(new Date(), 'yyyy-MM-dd')}`;
    
    if (type === "CSV") {
      // Mock CSV export
      const headers = ["Employee", "Date", "Check In", "Check Out", "Working Hours", "Status"];
      const csvData = filteredAttendance.map(record => [
        record.employeeName,
        format(new Date(record.date), "MMM dd, yyyy"),
        record.checkIn || "-",
        record.checkOut || "-",
        calculateWorkingHours(record.checkIn, record.checkOut),
        record.status
      ]);
      
      downloadCSV([headers, ...csvData], filename);
      toast.success(`Exported ${filteredAttendance.length} records as CSV`);
    } else if (type === "PDF") {
      // Mock PDF export
      toast.success(`Exporting ${filteredAttendance.length} records as PDF. This would download a PDF in a real implementation.`);
    }
  };
  
  // Helper function to calculate working hours
  const calculateWorkingHours = (checkIn: string | null, checkOut: string | null): string => {
    if (!checkIn || !checkOut || checkIn === '-' || checkOut === '-') return "00:00:00";
    
    // Simple mock calculation
    const hours = Math.floor(Math.random() * 4) + 6; // 6-9 hours
    const minutes = Math.floor(Math.random() * 60);
    const seconds = Math.floor(Math.random() * 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex w-full sm:w-auto items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start w-full sm:w-[200px]">
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
              
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("CSV")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("PDF")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>In Time</TableHead>
                <TableHead>Out Time</TableHead>
                <TableHead>Working Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.employeeName}</TableCell>
                    <TableCell>{format(new Date(record.date), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{record.checkIn || "-"}</TableCell>
                    <TableCell>{record.checkOut || "-"}</TableCell>
                    <TableCell>{calculateWorkingHours(record.checkIn, record.checkOut)}</TableCell>
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
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No attendance records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Attendance;
