
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmployeeTrackingMap from "@/components/tracking/EmployeeTrackingMap";
import { useQuery } from "@tanstack/react-query";
import { locationTrackingService } from "@/api/services/location-tracking.service";
import { toast } from "sonner";

const MapTracking = () => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      console.log("Fetching employee list");
      return await locationTrackingService.getEmployeeList();
    },
  });

  const { data: trackingData = [], isLoading: isLoadingTrackingData } = useQuery({
    queryKey: ["tracking-data", selectedEmployeeId, dateRange?.from, dateRange?.to],
    queryFn: async () => {
      if (!selectedEmployeeId || !dateRange?.from) {
        console.log("Missing employee ID or date range");
        return [];
      }
      
      const formattedStartDate = format(dateRange.from, "yyyy-MM-dd");
      const formattedEndDate = dateRange.to 
        ? format(dateRange.to, "yyyy-MM-dd") 
        : formattedStartDate;
      
      console.log(`Fetching tracking data for employee ${selectedEmployeeId} from ${formattedStartDate} to ${formattedEndDate}`);
        
      try {
        const data = await locationTrackingService.getEmployeeTrackingData(
          selectedEmployeeId,
          formattedStartDate,
          formattedEndDate
        );
        console.log(`Received ${data.length} tracking points`);
        return data;
      } catch (error) {
        console.error("Error fetching tracking data:", error);
        toast.error("Failed to load tracking data");
        return [];
      }
    },
    enabled: !!selectedEmployeeId && !!dateRange?.from,
  });

  const handleEmployeeChange = (value: string) => {
    console.log(`Selected employee: ${value}`);
    setSelectedEmployeeId(value);
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Employee Location Tracking</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <Card className="col-span-1 md:col-span-3">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Select Employee</Label>
                <Select value={selectedEmployeeId} onValueChange={handleEmployeeChange}>
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateRange">Date Range</Label>
                <DateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 md:col-span-9">
            <CardHeader>
              <CardTitle>
                {selectedEmployeeId 
                  ? `Location History: ${employees.find(e => e.id === selectedEmployeeId)?.name || 'Employee'}`
                  : 'Select an employee to view their location history'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] w-full">
                <EmployeeTrackingMap 
                  trackingData={trackingData} 
                  isLoading={isLoadingTrackingData}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default MapTracking;
