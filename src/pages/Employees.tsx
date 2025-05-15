import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Edit, Trash, Filter, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { employeeService } from "@/api/services";
import { Employee } from "@/api/repositories/employee.repository";
import { EmployeeForm } from "@/components/employee/EmployeeForm";
import { DeleteEmployeeDialog } from "@/components/employee/DeleteEmployeeDialog";
import { ExportDialog, ExportFilters } from "@/components/common/ExportDialog";
import { exportToExcel, formatDateRange } from "@/lib/export-utils";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 10;

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [positionFilter, setPositionFilter] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch employees data
  const { data: employees = [], refetch } = useQuery({
    queryKey: ["employees"],
    queryFn: employeeService.getAllEmployees,
  });

  // Get unique departments and positions for filters
  const departments = Array.from(new Set(employees.map(emp => emp.department)));
  const positions = Array.from(new Set(employees.map(emp => emp.position)));

  // Filter employees based on search term and filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
    const matchesPosition = !positionFilter || employee.position === positionFilter;
    
    return matchesSearch && matchesDepartment && matchesPosition;
  });
  
  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE));
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddEmployee = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleExport = (filters: ExportFilters) => {
    // Filter data according to export filters
    const dataToExport = employees.filter((employee) => {
      // For employees, we'll use the date range as a filter on their join date if it exists
      // This is just a placeholder implementation - modify as needed based on actual data model
      const matchesDateRange = true; // No date field in employee data in this example
      
      const matchesDepartment = filters.department
        ? employee.department === filters.department
        : true;
        
      const matchesDesignation = filters.designation
        ? employee.position === filters.designation
        : true;
      
      return matchesDateRange && matchesDepartment && matchesDesignation;
    });
    
    // Define headers and row mapping for Excel export
    const headers = ["Name", "Email", "Phone", "Position", "Department", "Status"];
    
    const rowMapper = (employee: Employee) => [
      employee.name,
      employee.email,
      employee.phone,
      employee.position,
      employee.department,
      employee.status === 'active' ? 'Active' : 'Inactive'
    ];

    // Generate filename with filters info
    const dateInfo = formatDateRange(filters.dateRange);
    const deptInfo = filters.department || "all-departments";
    const filename = `employees_data_${dateInfo}_${deptInfo}`;
    
    // Export to Excel
    exportToExcel(dataToExport, headers, rowMapper, filename);
  };

  // Legacy CSV export (keeping for backward compatibility)
  const handleLegacyExport = (type: string) => {
    const filename = `employees_data_${new Date().toISOString().split('T')[0]}`;
    
    if (type === "CSV") {
      // Mock CSV export
      const headers = ["Name", "Email", "Phone", "Position", "Department", "Status"];
      const csvData = filteredEmployees.map(employee => [
        employee.name,
        employee.email,
        employee.phone,
        employee.position,
        employee.department,
        employee.status
      ]);
      
      downloadCSV([headers, ...csvData], filename);
      toast.success(`Exported ${filteredEmployees.length} employees as CSV`);
    } else if (type === "PDF") {
      // Mock PDF export
      toast.success(`Exporting ${filteredEmployees.length} employees as PDF. This would download a PDF in a real implementation.`);
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

  const clearFilters = () => {
    setDepartmentFilter(null);
    setPositionFilter(null);
    setSearchTerm("");
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
        <Button className="bg-attendo-500 hover:bg-attendo-600" onClick={handleAddEmployee}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Employee
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Department</p>
                  <Select
                    value={departmentFilter || "all"}
                    onValueChange={(value) => setDepartmentFilter(value === "all" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <p className="text-sm font-medium mb-2 mt-4">Designation</p>
                  <Select
                    value={positionFilter || "all"}
                    onValueChange={(value) => setPositionFilter(value === "all" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Designations</SelectItem>
                      {positions.map((pos) => (
                        <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    size="sm"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              size="sm"
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        employee.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {employee.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteEmployee(employee)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    No employees found
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

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <EmployeeForm 
            onSuccess={() => {
              setIsAddDialogOpen(false);
              refetch();
              toast("Employee added successfully");
            }}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeForm 
              employee={selectedEmployee}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                refetch();
                toast("Employee updated successfully");
              }}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {selectedEmployee && (
        <DeleteEmployeeDialog
          employeeId={selectedEmployee.id}
          employeeName={selectedEmployee.name}
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onSuccess={() => {
            setIsDeleteDialogOpen(false);
            refetch();
          }}
        />
      )}
      
      {/* Export Dialog */}
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={handleExport}
        departments={departments}
        designations={positions}
        title="Export Employee Data"
      />
    </MainLayout>
  );
};

export default Employees;
