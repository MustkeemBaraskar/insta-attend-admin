
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock leave data
const leaveData = [
  { id: 1, employeeName: "John Doe", type: "Sick Leave", startDate: "2025-04-10", endDate: "2025-04-11", days: 2, status: "Approved", reason: "Medical appointment" },
  { id: 2, employeeName: "Jane Smith", type: "Vacation", startDate: "2025-04-15", endDate: "2025-04-22", days: 8, status: "Pending", reason: "Family vacation" },
  { id: 3, employeeName: "Robert Johnson", type: "Personal Leave", startDate: "2025-04-25", endDate: "2025-04-25", days: 1, status: "Approved", reason: "Personal matters" },
  { id: 4, employeeName: "Emily Davis", type: "Sick Leave", startDate: "2025-04-08", endDate: "2025-04-09", days: 2, status: "Rejected", reason: "Not feeling well" },
  { id: 5, employeeName: "Michael Wilson", type: "Vacation", startDate: "2025-05-01", endDate: "2025-05-07", days: 7, status: "Pending", reason: "Summer vacation" },
];

const Leave = () => {
  const [leaves, setLeaves] = useState(leaveData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Filter leave data based on search, status and type
  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? leave.status === statusFilter : true;
    const matchesType = typeFilter ? leave.type === typeFilter : true;
    return matchesSearch && matchesStatus && matchesType;
  });

  const leaveTypeStats = {
    sick: 24,
    vacation: 45,
    personal: 12,
    other: 5,
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Leave Management</h1>
        <Button className="bg-attendo-500 hover:bg-attendo-600">
          <Calendar className="h-4 w-4 mr-2" />
          Apply for Leave
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Sick Leave</p>
                <h3 className="text-2xl font-bold">{leaveTypeStats.sick}</h3>
              </div>
              <div className="p-3 rounded-full bg-red-100 text-red-700">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Vacation</p>
                <h3 className="text-2xl font-bold">{leaveTypeStats.vacation}</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-700">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Personal Leave</p>
                <h3 className="text-2xl font-bold">{leaveTypeStats.personal}</h3>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-700">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Other</p>
                <h3 className="text-2xl font-bold">{leaveTypeStats.other}</h3>
              </div>
              <div className="p-3 rounded-full bg-purple-100 text-purple-700">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search leaves..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                <SelectItem value="Vacation">Vacation</SelectItem>
                <SelectItem value="Personal Leave">Personal Leave</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell className="font-medium">{leave.employeeName}</TableCell>
                    <TableCell>{leave.type}</TableCell>
                    <TableCell>{format(new Date(leave.startDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{format(new Date(leave.endDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{leave.days}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          leave.status === "Approved" ? "outline" : 
                          leave.status === "Rejected" ? "destructive" : "secondary"
                        }
                        className={
                          leave.status === "Approved" ? "bg-green-100 text-green-800 border-green-200" : 
                          leave.status === "Rejected" ? "bg-red-100 text-red-800 border-red-200" :
                          "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }
                      >
                        {leave.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{leave.reason}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    No leave records found
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

export default Leave;
