
import { locationTrackingRepository, TrackingPoint } from '../repositories/location-tracking.repository';
import { toast } from 'sonner';

// Mock data for employees (minimal version for dropdown)
const mockEmployees = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Robert Johnson' },
  { id: '4', name: 'Emily Davis' },
  { id: '5', name: 'Michael Wilson' }
];

export const locationTrackingService = {
  getEmployeeList: async () => {
    try {
      console.log("Returning mock employee list");
      // Return mock employee list for dropdown selection
      return mockEmployees;
    } catch (error) {
      console.error("Error in getEmployeeList:", error);
      toast.error('Failed to fetch employee list.');
      return [];
    }
  },
  
  getEmployeeTrackingData: async (employeeId: string, startDate: string, endDate: string) => {
    try {
      console.log(`Service: Getting tracking data for employee ${employeeId} from ${startDate} to ${endDate}`);
      
      // Use repository to fetch tracking data
      const response = await locationTrackingRepository.getTrackingData(employeeId, startDate, endDate);
      
      console.log(`Service: Received ${response.data.length} tracking points`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tracking data:', error);
      toast.error('Failed to fetch tracking data.');
      return [];
    }
  }
};
