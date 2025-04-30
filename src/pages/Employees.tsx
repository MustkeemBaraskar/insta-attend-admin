
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Edit, Trash, Filter, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Mock data
const employeesData = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "555-123-4567", designation: "Software Developer", department: "Engineering" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "555-765-4321", designation: "HR Manager", department: "Human Resources" },
  { id: 3, name: "Robert Johnson", email: "robert@example.com", phone: "555-222-3333", designation: "Project Manager", department: "Operations" },
  { id: 4, name: "Emily Davis", email: "emily@example.com", phone: "555-444-5555", designation: "UX Designer", department: "Design" },
  { id: 5, name: "Michael Wilson", email: "michael@example.com", phone: "555-666-7777", designation: "System Administrator", department: "IT" },
  { id: 6, name: "Sarah Thompson", email: "sarah@example.com", phone: "555-888-9999", designation: "Marketing Specialist", department: "Marketing" },
  { id: 7, name: "David Miller", email: "david@example.com", phone: "555-111-2222", designation: "Accountant", department: "Finance" },
  { id: 8, name: "Lisa Brown", email: "lisa@example.com", phone: "555-333-4444", designation: "Content Writer", department: "Marketing" },
  { id: 9, name: "James Wilson", email: "james@example.com", phone: "555-555-6666", designation: "QA Engineer", department: "Engineering" },
  { id: 10, name: "Jennifer Lee", email: "jennifer@example.com", phone: "555-777-8888", designation: "Sales Representative", department: "Sales" },
];

const Employees = () => {
  const [employees, setEmployees] = useState(employeesData);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setEmployees(employees.filter(employee => employee.id !== id));
    toast({
      title: "Employee Deleted",
      description: "Employee has been successfully removed.",
    });
  };

  const handleExport = (type: string) => {
    toast({
      title: `Exporting ${type}`,
      description: `Employees data will be exported as ${type}.`,
    });
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
        <Button className="bg-attendo-500 hover:bg-attendo-600">
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{employee.designation}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(employee.id)}
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
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No employees found
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

export default Employees;
