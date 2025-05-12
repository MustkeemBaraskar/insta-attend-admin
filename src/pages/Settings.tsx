
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DepartmentForm } from "@/components/settings/DepartmentForm";
import { DesignationForm } from "@/components/settings/DesignationForm";
import { Pencil, Plus, Trash2 } from "lucide-react";

// Mock data
const designations = [
  { id: 1, name: "Software Developer", department: "Engineering", hasAdminAccess: false },
  { id: 2, name: "HR Manager", department: "Human Resources", hasAdminAccess: true },
  { id: 3, name: "Project Manager", department: "Operations", hasAdminAccess: true },
  { id: 4, name: "UX Designer", department: "Design", hasAdminAccess: false },
  { id: 5, name: "System Administrator", department: "IT", hasAdminAccess: true },
  { id: 6, name: "Marketing Specialist", department: "Marketing", hasAdminAccess: false },
];

const departments = [
  { 
    id: 1, 
    name: "Engineering", 
    employeeCount: 18,
    coordinates: "37.7749,-122.4194",
    address: "123 Tech Avenue, San Francisco, CA",
    lead: "John Doe" 
  },
  { 
    id: 2, 
    name: "Human Resources", 
    employeeCount: 5,
    coordinates: "37.7833,-122.4167",
    address: "456 HR Street, San Francisco, CA",
    lead: "Jane Smith" 
  },
  { 
    id: 3, 
    name: "Operations", 
    employeeCount: 8,
    coordinates: "37.7834,-122.4080",
    address: "789 Operations Blvd, San Francisco, CA",
    lead: "Michael Johnson" 
  },
  { 
    id: 4, 
    name: "Design", 
    employeeCount: 7,
    coordinates: "37.7835,-122.4050",
    address: "321 Creative Way, San Francisco, CA",
    lead: "Emily Davis" 
  },
  { 
    id: 5, 
    name: "IT", 
    employeeCount: 6,
    coordinates: "37.7836,-122.4020",
    address: "654 Tech Support Lane, San Francisco, CA",
    lead: "Robert Wilson" 
  },
  { 
    id: 6, 
    name: "Marketing", 
    employeeCount: 4,
    coordinates: "37.7837,-122.3990",
    address: "987 Brand Street, San Francisco, CA",
    lead: "Sarah Thompson" 
  },
  { 
    id: 7, 
    name: "Finance", 
    employeeCount: 3,
    coordinates: "37.7838,-122.3960",
    address: "135 Money Road, San Francisco, CA",
    lead: "David Brown" 
  },
  { 
    id: 8, 
    name: "Sales", 
    employeeCount: 4,
    coordinates: "37.7839,-122.3930",
    address: "246 Revenue Drive, San Francisco, CA",
    lead: "Jennifer Miller" 
  },
];

const companyData = {
  name: "Insta Attend Inc.",
  address: "123 Business Avenue, Tech Park, CA 94103",
  phone: "+1 (555) 987-6543",
  email: "info@insta-attend.com",
  website: "www.insta-attend.com",
  taxId: "12-3456789",
};

const Settings = () => {
  const [company, setCompany] = useState(companyData);
  const [departmentsList, setDepartmentsList] = useState(departments);
  const [designationsList, setDesignationsList] = useState(designations);
  const { toast } = useToast();
  
  // State for add/edit dialogs
  const [addDepartmentOpen, setAddDepartmentOpen] = useState(false);
  const [editDepartmentOpen, setEditDepartmentOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<(typeof departments)[0] | undefined>(undefined);
  
  const [addDesignationOpen, setAddDesignationOpen] = useState(false);
  const [editDesignationOpen, setEditDesignationOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState<(typeof designations)[0] | undefined>(undefined);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompany(prev => ({ ...prev, [name]: value }));
  };

  const saveCompanyData = () => {
    toast({
      title: "Company Data Saved",
      description: "Your company information has been updated successfully.",
    });
  };
  
  const handleAddDepartment = (values: any) => {
    const newDepartment = {
      id: departmentsList.length + 1,
      name: values.name,
      employeeCount: 0,
      coordinates: values.coordinates,
      address: values.address,
      lead: values.lead
    };
    setDepartmentsList([...departmentsList, newDepartment]);
  };
  
  const handleUpdateDepartment = (values: any) => {
    if (selectedDepartment) {
      const updatedDepartments = departmentsList.map(dept => 
        dept.id === selectedDepartment.id 
          ? { 
              ...dept, 
              name: values.name,
              coordinates: values.coordinates,
              address: values.address,
              lead: values.lead
            } 
          : dept
      );
      setDepartmentsList(updatedDepartments);
    }
  };
  
  const handleDeleteDepartment = (id: number) => {
    setDepartmentsList(departmentsList.filter(dept => dept.id !== id));
    toast({
      title: "Department Deleted",
      description: "The department has been deleted successfully.",
    });
  };
  
  const handleAddDesignation = (values: any) => {
    const departmentName = departmentsList.find(dept => dept.id === values.departmentId)?.name || '';
    const newDesignation = {
      id: designationsList.length + 1,
      name: values.name,
      department: departmentName,
      hasAdminAccess: values.hasAdminAccess
    };
    setDesignationsList([...designationsList, newDesignation]);
  };
  
  const handleUpdateDesignation = (values: any) => {
    if (selectedDesignation) {
      const departmentName = departmentsList.find(dept => dept.id === values.departmentId)?.name || selectedDesignation.department;
      const updatedDesignations = designationsList.map(desg => 
        desg.id === selectedDesignation.id 
          ? { 
              ...desg, 
              name: values.name,
              department: departmentName,
              hasAdminAccess: values.hasAdminAccess
            } 
          : desg
      );
      setDesignationsList(updatedDesignations);
    }
  };
  
  const handleDeleteDesignation = (id: number) => {
    setDesignationsList(designationsList.filter(desg => desg.id !== id));
    toast({
      title: "Designation Deleted",
      description: "The designation has been deleted successfully.",
    });
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="designations">Designations</TabsTrigger>
          <TabsTrigger value="general">General Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  name="name"
                  value={company.name}
                  onChange={handleCompanyChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={company.address}
                  onChange={handleCompanyChange}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={company.phone}
                    onChange={handleCompanyChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={company.email}
                    onChange={handleCompanyChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={company.website}
                    onChange={handleCompanyChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / Registration Number</Label>
                  <Input
                    id="taxId"
                    name="taxId"
                    value={company.taxId}
                    onChange={handleCompanyChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveCompanyData} className="bg-attendo-500 hover:bg-attendo-600">
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="departments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Departments</CardTitle>
                <CardDescription>
                  Manage company departments and teams
                </CardDescription>
              </div>
              <Button 
                className="bg-attendo-500 hover:bg-attendo-600"
                onClick={() => setAddDepartmentOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Department Name</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentsList.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell className="font-medium">{department.id}</TableCell>
                      <TableCell>{department.name}</TableCell>
                      <TableCell>{department.lead || "—"}</TableCell>
                      <TableCell>{department.address ? `${department.address.substring(0, 20)}...` : "—"}</TableCell>
                      <TableCell>{department.employeeCount}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0 mr-2"
                          onClick={() => {
                            setSelectedDepartment(department);
                            setEditDepartmentOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteDepartment(department.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Department forms */}
          <DepartmentForm 
            open={addDepartmentOpen}
            onOpenChange={setAddDepartmentOpen}
            onSubmit={handleAddDepartment}
          />
          
          <DepartmentForm 
            open={editDepartmentOpen}
            onOpenChange={setEditDepartmentOpen}
            department={selectedDepartment}
            onSubmit={handleUpdateDepartment}
          />
        </TabsContent>
        
        <TabsContent value="designations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Designations</CardTitle>
                <CardDescription>
                  Manage employee roles and designations
                </CardDescription>
              </div>
              <Button 
                className="bg-attendo-500 hover:bg-attendo-600"
                onClick={() => setAddDesignationOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Designation
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Admin Access</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {designationsList.map((designation) => (
                    <TableRow key={designation.id}>
                      <TableCell className="font-medium">{designation.id}</TableCell>
                      <TableCell>{designation.name}</TableCell>
                      <TableCell>{designation.department}</TableCell>
                      <TableCell>{designation.hasAdminAccess ? "Yes" : "No"}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0 mr-2"
                          onClick={() => {
                            setSelectedDesignation(designation);
                            setEditDesignationOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteDesignation(designation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Designation forms */}
          <DesignationForm 
            open={addDesignationOpen}
            onOpenChange={setAddDesignationOpen}
            departments={departmentsList}
            onSubmit={handleAddDesignation}
          />
          
          <DesignationForm 
            open={editDesignationOpen}
            onOpenChange={setEditDesignationOpen}
            designation={selectedDesignation}
            departments={departmentsList}
            onSubmit={handleUpdateDesignation}
          />
        </TabsContent>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="work-hours">Standard Work Hours</Label>
                <Input id="work-hours" type="number" defaultValue={8} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="America/New_York" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="week-start">Week Start Day</Label>
                  <Input id="week-start" defaultValue="Monday" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Input id="date-format" defaultValue="MM/DD/YYYY" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="leave-year">Leave Year Start</Label>
                <Input id="leave-year" defaultValue="January 1" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-attendo-500 hover:bg-attendo-600">
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;

