
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { FileText, Download, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { payrollService } from "@/api/services";

// Mock payroll data
const mockPayrollData = [
  {
    id: "p1",
    employeeId: "1",
    employeeName: "John Doe",
    month: "April",
    year: 2025,
    baseSalary: 5200,
    bonuses: 300,
    deductions: 650,
    netSalary: 4850,
    paymentStatus: "paid",
    paymentDate: "2025-04-05",
  },
  {
    id: "p2",
    employeeId: "2",
    employeeName: "Jane Smith",
    month: "April",
    year: 2025,
    baseSalary: 4800,
    bonuses: 200,
    deductions: 520,
    netSalary: 4480,
    paymentStatus: "paid",
    paymentDate: "2025-04-05",
  },
  {
    id: "p3",
    employeeId: "3",
    employeeName: "Michael Johnson",
    month: "April",
    year: 2025,
    baseSalary: 3900,
    bonuses: 150,
    deductions: 480,
    netSalary: 3570,
    paymentStatus: "pending",
    paymentDate: null,
  },
];

const Payroll = () => {
  const [payrolls, setPayrolls] = useState(mockPayrollData);
  const [month, setMonth] = useState("April");
  const [year, setYear] = useState("2025");
  const [showProcessed, setShowProcessed] = useState(false);

  const generateNewPayroll = () => {
    toast.success(`Payroll generated for ${month} ${year}`);
    setShowProcessed(true);
  };

  const downloadPayslip = (id: string, employeeName: string) => {
    toast.success(`Downloading payslip for ${employeeName}`);
    // In a real app this would download a PDF
  };

  const markAsPaid = (id: string) => {
    setPayrolls(payrolls.map(payroll => 
      payroll.id === id ? { ...payroll, paymentStatus: 'paid', paymentDate: format(new Date(), 'yyyy-MM-dd') } : payroll
    ));
    toast.success('Payroll marked as paid');
  };

  const exportPayrollReport = (type: string) => {
    toast.success(`Exporting payroll report as ${type}`);
    // In a real app this would generate a downloadable file
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payroll Management</h1>
        <div className="flex gap-2">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="January">January</SelectItem>
              <SelectItem value="February">February</SelectItem>
              <SelectItem value="March">March</SelectItem>
              <SelectItem value="April">April</SelectItem>
              <SelectItem value="May">May</SelectItem>
              <SelectItem value="June">June</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="bg-attendo-500 hover:bg-attendo-600" onClick={generateNewPayroll}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Payslips
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Payroll Overview</CardTitle>
            <CardDescription>Current Month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Employees</span>
              <span className="font-medium">52</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Processed Payslips</span>
              <span className="font-medium">{showProcessed ? "52" : "0"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pending Payslips</span>
              <span className="font-medium">{showProcessed ? "0" : "52"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Salary Amount</span>
              <span className="font-medium">$247,500.00</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Recent Payrolls</CardTitle>
            <CardDescription>Last 3 Months</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">March 2025</span>
              <span className="font-medium">$242,800.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">February 2025</span>
              <span className="font-medium">$239,500.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">January 2025</span>
              <span className="font-medium">$236,200.00</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
            <CardDescription>Download Reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => exportPayrollReport('PDF')}>
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => exportPayrollReport('CSV')}>
              <Download className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => exportPayrollReport('Excel')}>
              <Download className="h-4 w-4 mr-2" />
              Export as Excel
            </Button>
          </CardContent>
        </Card>
      </div>

      {!showProcessed ? (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Payroll Processing</CardTitle>
            <CardDescription>{month} {year} - Pending</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Payroll Generated Yet</h3>
              <p className="text-gray-500 mb-6">Generate payroll for {month} {year} to view and process employee salaries.</p>
              <Button className="bg-attendo-500 hover:bg-attendo-600 mx-auto" onClick={generateNewPayroll}>
                Start Processing Payroll
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Payroll Details</CardTitle>
              <CardDescription>{month} {year} - Processed</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Base Salary</TableHead>
                    <TableHead>Bonuses</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrolls.map((payroll) => (
                    <TableRow key={payroll.id}>
                      <TableCell className="font-medium">{payroll.employeeName}</TableCell>
                      <TableCell>${payroll.baseSalary.toFixed(2)}</TableCell>
                      <TableCell>${payroll.bonuses.toFixed(2)}</TableCell>
                      <TableCell>${payroll.deductions.toFixed(2)}</TableCell>
                      <TableCell>${payroll.netSalary.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge 
                          className={payroll.paymentStatus === 'paid' 
                            ? "bg-green-100 text-green-800 border-green-200" 
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"}
                        >
                          {payroll.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => downloadPayslip(payroll.id, payroll.employeeName)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Payslip
                          </Button>
                          
                          {payroll.paymentStatus === 'pending' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-green-200 text-green-700 hover:bg-green-50"
                              onClick={() => markAsPaid(payroll.id)}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Mark Paid
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </MainLayout>
  );
};

export default Payroll;
