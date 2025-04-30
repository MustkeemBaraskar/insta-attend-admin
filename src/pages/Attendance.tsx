
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Filter, FileText } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

// Mock attendance data
const attendanceData = [
  { id: 1, employeeId: 1, employeeName: "John Doe", date: "2025-04-23", inTime: "09:02:34", outTime: "17:05:22", totalHours: "08:02:48", status: "Present" },
  { id: 2, employeeId: 2, employeeName: "Jane Smith", date: "2025-04-23", inTime: "08:55:12", outTime: "17:10:45", totalHours: "08:15:33", status: "Present" },
  { id: 3, employeeId: 3, employeeName: "Robert Johnson", date: "2025-04-23", inTime: "09:15:22", outTime: "17:00:10", totalHours: "07:44:48", status: "Late" },
  { id: 4, employeeId: 4, employeeName: "Emily Davis", date: "2025-04-23", inTime: "-", outTime: "-", totalHours: "00:00:00", status: "Absent" },
  { id: 5, employeeId: 5, employeeName: "Michael Wilson", date: "2025-04-23", inTime: "08:50:32", outTime: "17:05:44", totalHours: "08:15:12", status: "Present" },
  { id: 6, employeeId: 1, employeeName: "John Doe", date: "2025-04-24", inTime: "08:58:34", outTime: "17:10:22", totalHours: "08:11:48", status: "Present" },
  { id: 7, employeeId: 2, employeeName: "Jane Smith", date: "2025-04-24", inTime: "08:59:42", outTime: "17:05:15", totalHours: "08:05:33", status: "Present" },
  { id: 8, employeeId: 3, employeeName: "Robert Johnson", date: "2025-04-24", inTime: "-", outTime: "-", totalHours: "00:00:00", status: "Absent" },
  { id: 9, employeeId: 4, employeeName: "Emily Davis", date: "2025-04-24", inTime: "08:57:22", outTime: "17:00:10", totalHours: "08:02:48", status: "Present" },
  { id: 10, employeeId: 5, employeeName: "Michael Wilson", date: "2025-04-24", inTime: "09:10:32", outTime: "17:15:44", totalHours: "08:05:12", status: "Late" },
];

// Employees list for filtering
const employees = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Robert Johnson" },
  { id: 4, name: "Emily Davis" },
  { id: 5, name: "Michael Wilson" },
];

const Attendance = () => {
  const [attendance, setAttendance] = useState(attendanceData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string | undefined>();
  const { toast } = useToast();

  // Filter attendance data based on search, date and employee
  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate ? record.date === format(selectedDate, "yyyy-MM-dd") : true;
    const matchesEmployee = selectedEmployee ? record.employeeId.toString() === selectedEmployee : true;
    return matchesSearch && matchesDate && matchesEmployee;
  });

  const handleExport = (type: string) => {
    toast({
      title: `Exporting ${type}`,
      description: `Attendance data will be exported as ${type}.`,
    });
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
                    <SelectItem key={employee.id} value={employee.id.toString()}>
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
                  <FileText className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("CSV")}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("PDF")}>
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
                    <TableCell>{record.inTime}</TableCell>
                    <TableCell>{record.outTime}</TableCell>
                    <TableCell>{record.totalHours}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        record.status === "Present" && "bg-green-100 text-green-800",
                        record.status === "Late" && "bg-yellow-100 text-yellow-800",
                        record.status === "Absent" && "bg-red-100 text-red-800"
                      )}>
                        {record.status}
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
