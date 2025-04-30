
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

// Mock data
const designations = [
  { id: 1, name: "Software Developer", department: "Engineering" },
  { id: 2, name: "HR Manager", department: "Human Resources" },
  { id: 3, name: "Project Manager", department: "Operations" },
  { id: 4, name: "UX Designer", department: "Design" },
  { id: 5, name: "System Administrator", department: "IT" },
  { id: 6, name: "Marketing Specialist", department: "Marketing" },
];

const departments = [
  { id: 1, name: "Engineering", employeeCount: 18 },
  { id: 2, name: "Human Resources", employeeCount: 5 },
  { id: 3, name: "Operations", employeeCount: 8 },
  { id: 4, name: "Design", employeeCount: 7 },
  { id: 5, name: "IT", employeeCount: 6 },
  { id: 6, name: "Marketing", employeeCount: 4 },
  { id: 7, name: "Finance", employeeCount: 3 },
  { id: 8, name: "Sales", employeeCount: 4 },
];

const companyData = {
  name: "Attendo Inc.",
  address: "123 Business Avenue, Tech Park, CA 94103",
  phone: "+1 (555) 987-6543",
  email: "info@attendo.com",
  website: "www.attendo.com",
  taxId: "12-3456789",
};

const Settings = () => {
  const [company, setCompany] = useState(companyData);
  const { toast } = useToast();

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
              <Button className="bg-attendo-500 hover:bg-attendo-600">
                Add Department
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Department Name</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell className="font-medium">{department.id}</TableCell>
                      <TableCell>{department.name}</TableCell>
                      <TableCell>{department.employeeCount}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" className="h-8 w-8 p-0 mr-2">
                          Edit
                        </Button>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
              <Button className="bg-attendo-500 hover:bg-attendo-600">
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {designations.map((designation) => (
                    <TableRow key={designation.id}>
                      <TableCell className="font-medium">{designation.id}</TableCell>
                      <TableCell>{designation.name}</TableCell>
                      <TableCell>{designation.department}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" className="h-8 w-8 p-0 mr-2">
                          Edit
                        </Button>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
