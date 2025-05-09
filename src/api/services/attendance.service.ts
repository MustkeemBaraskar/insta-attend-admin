
import { attendanceRepository, Attendance, CheckInRequest, CheckOutRequest } from '../repositories/attendance.repository';
import { toast } from 'sonner';

// Mock data for employees (minimal version for dropdown)
const mockEmployees = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Robert Johnson' },
  { id: '4', name: 'Emily Davis' },
  { id: '5', name: 'Michael Wilson' }
];

// Mock data for attendance records
const mockAttendanceData: Attendance[] = [
  { id: '1', employeeId: '1', employeeName: 'John Doe', date: '2025-04-23', checkIn: '09:02:34', checkOut: '17:05:22', status: 'present' },
  { id: '2', employeeId: '2', employeeName: 'Jane Smith', date: '2025-04-23', checkIn: '08:55:12', checkOut: '17:10:45', status: 'present' },
  { id: '3', employeeId: '3', employeeName: 'Robert Johnson', date: '2025-04-23', checkIn: '09:15:22', checkOut: '17:00:10', status: 'late' },
  { id: '4', employeeId: '4', employeeName: 'Emily Davis', date: '2025-04-23', checkIn: null, checkOut: null, status: 'absent' },
  { id: '5', employeeId: '5', employeeName: 'Michael Wilson', date: '2025-04-23', checkIn: '08:50:32', checkOut: '17:05:44', status: 'present' },
  { id: '6', employeeId: '1', employeeName: 'John Doe', date: '2025-04-24', checkIn: '08:58:34', checkOut: '17:10:22', status: 'present' },
  { id: '7', employeeId: '2', employeeName: 'Jane Smith', date: '2025-04-24', checkIn: '08:59:42', checkOut: '17:05:15', status: 'present' },
  { id: '8', employeeId: '3', employeeName: 'Robert Johnson', date: '2025-04-24', checkIn: null, checkOut: null, status: 'absent' },
  { id: '9', employeeId: '4', employeeName: 'Emily Davis', date: '2025-04-24', checkIn: '08:57:22', checkOut: '17:00:10', status: 'present' },
  { id: '10', employeeId: '5', employeeName: 'Michael Wilson', date: '2025-04-24', checkIn: '09:10:32', checkOut: '17:15:44', status: 'late' },
  { id: '11', employeeId: '1', employeeName: 'John Doe', date: '2025-04-25', checkIn: '08:59:34', checkOut: '13:00:22', status: 'half-day' },
  { id: '12', employeeId: '2', employeeName: 'Jane Smith', date: '2025-04-25', checkIn: '08:58:42', checkOut: '17:05:15', status: 'present' },
  { id: '13', employeeId: '3', employeeName: 'Robert Johnson', date: '2025-04-25', checkIn: '08:45:00', checkOut: '17:00:10', status: 'present' },
  { id: '14', employeeId: '4', employeeName: 'Emily Davis', date: '2025-04-25', checkIn: '09:17:22', checkOut: '17:10:10', status: 'late' },
  { id: '15', employeeId: '5', employeeName: 'Michael Wilson', date: '2025-04-25', checkIn: null, checkOut: null, status: 'absent' }
];

export const attendanceService = {
  getAllAttendance: async (startDate?: string, endDate?: string) => {
    try {
      // Return mock data for now
      // In a real implementation, this would call attendanceRepository.getAll()
      return mockAttendanceData;
    } catch (error) {
      toast.error('Failed to fetch attendance records.');
      return [];
    }
  },
  
  getAttendanceByEmployeeId: async (employeeId: string, startDate?: string, endDate?: string) => {
    try {
      // Filter mock data
      const filteredAttendance = mockAttendanceData.filter(record => record.employeeId === employeeId);
      
      // In a real implementation, this would call attendanceRepository.getByEmployeeId()
      return filteredAttendance;
    } catch (error) {
      toast.error('Failed to fetch employee attendance records.');
      return [];
    }
  },
  
  getEmployeeList: async () => {
    try {
      // Return mock employee list for dropdown selection
      return mockEmployees;
    } catch (error) {
      toast.error('Failed to fetch employee list.');
      return [];
    }
  },
  
  checkIn: async (data: CheckInRequest) => {
    try {
      const response = await attendanceRepository.checkIn(data);
      toast.success('Check-in recorded successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to record check-in.');
      throw error;
    }
  },
  
  checkOut: async (data: CheckOutRequest) => {
    try {
      const response = await attendanceRepository.checkOut(data);
      toast.success('Check-out recorded successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to record check-out.');
      throw error;
    }
  },
  
  getAttendanceReports: async (startDate: string, endDate: string) => {
    try {
      const response = await attendanceRepository.getReports({ startDate, endDate });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch attendance reports.');
      throw error;
    }
  },
};
