import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Search, Filter, Check, X } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Mock leave data
const initialLeaveData = [
  { id: "1", employeeId: "1", employeeName: "John Doe", type: "Sick Leave", startDate: "2025-04-10", endDate: "2025-04-11", days: 2, status: "Approved", reason: "Medical appointment", appliedOn: "2025-04-05" },
  { id: "2", employeeId: "2", employeeName: "Jane Smith", type: "Vacation", startDate: "2025-04-15", endDate: "2025-04-22", days: 8, status: "Pending", reason: "Family vacation", appliedOn: "2025-04-08" },
  { id: "3", employeeId: "3", employeeName: "Robert Johnson", type: "Personal Leave", startDate: "2025-04-25", endDate: "2025-04-25", days: 1, status: "Approved", reason: "Personal matters", appliedOn: "2025-04-12" },
  { id: "4", employeeId: "4", employeeName: "Emily Davis", type: "Sick Leave", startDate: "2025-04-08", endDate: "2025-04-09", days: 2, status: "Rejected", reason: "Not feeling well", rejectedReason: "Insufficient sick leave balance", appliedOn: "2025-04-03" },
  { id: "5", employeeId: "5", employeeName: "Michael Wilson", type: "Vacation", startDate: "2025-05-01", endDate: "2025-05-07", days: 7, status: "Pending", reason: "Summer vacation", appliedOn: "2025-04-15" },
];

const Leave = () => {
  const [leaves, setLeaves] = useState(initialLeaveData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  
  // New leave application form state
  const [leaveForm, setLeaveForm] = useState({
    type: "Sick Leave",
    startDate: "",
    endDate: "",
    reason: ""
  });
  
  // Rejection reason
  const [rejectionReason, setRejectionReason] = useState("");

  // Filter leave data based on search, status and type
  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? leave.status === statusFilter : true;
    const matchesType = typeFilter ? leave.type === typeFilter : true;
    return matchesSearch && matchesStatus && matchesType;
  });

  const leaveTypeStats = {
    sick: leaves.filter(leave => leave.type === "Sick Leave").length,
    vacation: leaves.filter(leave => leave.type === "Vacation").length,
    personal: leaves.filter(leave => leave.type === "Personal Leave").length,
    other: leaves.filter(leave => leave.type === "Other").length,
  };
  
  const handleApplyLeave = () => {
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Calculate days between start and end date
    const startDate = new Date(leaveForm.startDate);
    const endDate = new Date(leaveForm.endDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    const newLeave = {
      id: `${leaves.length + 1}`,
      employeeId: "1", // Assuming current user
      employeeName: "John Doe", // Assuming current user
      type: leaveForm.type,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      days: diffDays,
      status: "Pending",
      reason: leaveForm.reason,
      appliedOn: format(new Date(), "yyyy-MM-dd")
    };
    
    setLeaves([...leaves, newLeave]);
    setIsApplyDialogOpen(false);
    toast.success("Leave application submitted successfully");
    
    // Reset form
    setLeaveForm({
      type: "Sick Leave",
      startDate: "",
      endDate: "",
      reason: ""
    });
  };
  
  const handleApproveLeave = () => {
    if (!selectedLeave) return;
    
    const updatedLeaves = leaves.map(leave => 
      leave.id === selectedLeave.id ? { ...leave, status: "Approved", approvedBy: "Admin" } : leave
    );
    
    setLeaves(updatedLeaves);
    setIsApproveDialogOpen(false);
    setSelectedLeave(null);
    toast.success("Leave request approved");
  };
  
  const handleRejectLeave = () => {
    if (!selectedLeave || !rejectionReason) {
      toast.error("Please provide a rejection reason");
      return;
    }
    
    const updatedLeaves = leaves.map(leave => 
      leave.id === selectedLeave.id ? { ...leave, status: "Rejected", rejectedReason: rejectionReason } : leave
    );
    
    setLeaves(updatedLeaves);
    setIsRejectDialogOpen(false);
    setSelectedLeave(null);
    setRejectionReason("");
    toast.success("Leave request rejected");
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Leave Management</h1>
        <Button className="bg-attendo-500 hover:bg-attendo-600" onClick={() => setIsApplyDialogOpen(true)}>
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
                <SelectItem value="all">All Status</SelectItem>
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
                <SelectItem value="all">All Types</SelectItem>
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
                <TableHead>Actions</TableHead>
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
                    <TableCell>
                      {leave.status === "Pending" && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-green-200 text-green-700 hover:bg-green-50"
                            onClick={() => {
                              setSelectedLeave(leave);
                              setIsApproveDialogOpen(true);
                            }}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setSelectedLeave(leave);
                              setIsRejectDialogOpen(true);
                            }}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    No leave records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Apply for Leave Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
            <DialogDescription>
              Fill out the form below to submit your leave request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="leave-type">Leave Type</Label>
              <Select 
                value={leaveForm.type}
                onValueChange={(value) => setLeaveForm({...leaveForm, type: value})}
              >
                <SelectTrigger id="leave-type">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Vacation">Vacation</SelectItem>
                  <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input 
                  id="start-date" 
                  type="date" 
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({...leaveForm, startDate: e.target.value})}
                  min={format(new Date(), "yyyy-MM-dd")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input 
                  id="end-date" 
                  type="date"
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm({...leaveForm, endDate: e.target.value})}
                  min={leaveForm.startDate || format(new Date(), "yyyy-MM-dd")}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave</Label>
              <Textarea 
                id="reason" 
                placeholder="Please provide details for your leave request"
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApplyLeave}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Approve Leave Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Approve Leave Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this leave request?
            </DialogDescription>
          </DialogHeader>
          {selectedLeave && (
            <div className="py-4">
              <p><strong>Employee:</strong> {selectedLeave.employeeName}</p>
              <p><strong>Leave Type:</strong> {selectedLeave.type}</p>
              <p><strong>Duration:</strong> {format(new Date(selectedLeave.startDate), "MMM dd, yyyy")} to {format(new Date(selectedLeave.endDate), "MMM dd, yyyy")} ({selectedLeave.days} days)</p>
              <p><strong>Reason:</strong> {selectedLeave.reason}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApproveLeave} className="bg-green-600 hover:bg-green-700">Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Leave Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this leave request.
            </DialogDescription>
          </DialogHeader>
          {selectedLeave && (
            <div className="py-4 space-y-4">
              <div>
                <p><strong>Employee:</strong> {selectedLeave.employeeName}</p>
                <p><strong>Leave Type:</strong> {selectedLeave.type}</p>
                <p><strong>Duration:</strong> {format(new Date(selectedLeave.startDate), "MMM dd, yyyy")} to {format(new Date(selectedLeave.endDate), "MMM dd, yyyy")} ({selectedLeave.days} days)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Rejection Reason</Label>
                <Textarea 
                  id="rejection-reason" 
                  placeholder="Please provide a reason for rejection"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRejectLeave} variant="destructive">Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Leave;
