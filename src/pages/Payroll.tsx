
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Payroll = () => {
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payroll Management</h1>
        <Button className="bg-attendo-500 hover:bg-attendo-600">
          <FileText className="h-4 w-4 mr-2" />
          Generate Payslips
        </Button>
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
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pending Payslips</span>
              <span className="font-medium">52</span>
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
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Payroll Operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Generate Monthly Payroll
            </Button>
            <Button variant="outline" className="w-full justify-start">
              View Salary History
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Configure Deductions
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Tax Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Payroll Processing</CardTitle>
          <CardDescription>April 2025 - Pending</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payroll Generated Yet</h3>
            <p className="text-gray-500 mb-6">Generate payroll for April 2025 to view and process employee salaries.</p>
            <Button className="bg-attendo-500 hover:bg-attendo-600 mx-auto">
              Start Processing Payroll
            </Button>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Payroll;
