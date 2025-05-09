
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

// Enhanced mock data for attendance records
const mockAttendanceData: Attendance[] = [
  { 
    id: '1', 
    employeeId: '1', 
    employeeName: 'John Doe', 
    department: 'Engineering', 
    designation: 'Senior Developer',
    date: '2025-05-08', 
    checkIn: '09:02:34', 
    inLocation: 'Main Office, Floor 2',
    checkOut: '17:05:22', 
    outLocation: 'Main Office, Floor 2',
    status: 'present',
    workingHours: '08:02:48'
  },
  { 
    id: '2', 
    employeeId: '2', 
    employeeName: 'Jane Smith', 
    department: 'Human Resources', 
    designation: 'HR Manager',
    date: '2025-05-08', 
    checkIn: '08:55:12', 
    inLocation: 'Main Office, Floor 1',
    checkOut: '17:10:45', 
    outLocation: 'Main Office, Floor 1',
    status: 'present',
    workingHours: '08:15:33'
  },
  { 
    id: '3', 
    employeeId: '3', 
    employeeName: 'Robert Johnson', 
    department: 'Finance', 
    designation: 'Financial Analyst',
    date: '2025-05-08', 
    checkIn: '09:15:22', 
    inLocation: 'Branch Office A',
    checkOut: '17:00:10', 
    outLocation: 'Branch Office A',
    status: 'late',
    workingHours: '07:44:48'
  },
  { 
    id: '4', 
    employeeId: '4', 
    employeeName: 'Emily Davis', 
    department: 'Marketing', 
    designation: 'Marketing Specialist',
    date: '2025-05-08', 
    checkIn: null, 
    inLocation: null,
    checkOut: null, 
    outLocation: null,
    status: 'absent',
    workingHours: '00:00:00'
  },
  { 
    id: '5', 
    employeeId: '5', 
    employeeName: 'Michael Wilson', 
    department: 'IT', 
    designation: 'IT Support',
    date: '2025-05-08', 
    checkIn: '08:50:32', 
    inLocation: 'Remote',
    checkOut: '17:05:44', 
    outLocation: 'Remote',
    status: 'present',
    workingHours: '08:15:12'
  },
  { 
    id: '6', 
    employeeId: '1', 
    employeeName: 'John Doe', 
    department: 'Engineering', 
    designation: 'Senior Developer',
    date: '2025-05-07', 
    checkIn: '08:58:34', 
    inLocation: 'Main Office, Floor 2',
    checkOut: '17:10:22', 
    outLocation: 'Main Office, Floor 2',
    status: 'present',
    workingHours: '08:11:48'
  },
  { 
    id: '7', 
    employeeId: '2', 
    employeeName: 'Jane Smith', 
    department: 'Human Resources', 
    designation: 'HR Manager',
    date: '2025-05-07', 
    checkIn: '08:59:42', 
    inLocation: 'Main Office, Floor 1',
    checkOut: '17:05:15', 
    outLocation: 'Main Office, Floor 1',
    status: 'present',
    workingHours: '08:05:33'
  },
  { 
    id: '8', 
    employeeId: '3', 
    employeeName: 'Robert Johnson', 
    department: 'Finance', 
    designation: 'Financial Analyst',
    date: '2025-05-07', 
    checkIn: null, 
    inLocation: null,
    checkOut: null, 
    outLocation: null,
    status: 'absent',
    workingHours: '00:00:00'
  },
  { 
    id: '9', 
    employeeId: '4', 
    employeeName: 'Emily Davis', 
    department: 'Marketing', 
    designation: 'Marketing Specialist',
    date: '2025-05-07', 
    checkIn: '08:57:22', 
    inLocation: 'Branch Office B',
    checkOut: '17:00:10', 
    outLocation: 'Branch Office B',
    status: 'present',
    workingHours: '08:02:48'
  },
  { 
    id: '10', 
    employeeId: '5', 
    employeeName: 'Michael Wilson', 
    department: 'IT', 
    designation: 'IT Support',
    date: '2025-05-07', 
    checkIn: '09:10:32', 
    inLocation: 'Remote',
    checkOut: '17:15:44', 
    outLocation: 'Remote',
    status: 'late',
    workingHours: '08:05:12'
  },
  { 
    id: '11', 
    employeeId: '1', 
    employeeName: 'John Doe', 
    department: 'Engineering', 
    designation: 'Senior Developer',
    date: '2025-05-06', 
    checkIn: '08:59:34', 
    inLocation: 'Main Office, Floor 2',
    checkOut: '13:00:22', 
    outLocation: 'Main Office, Floor 2',
    status: 'half-day',
    workingHours: '04:00:48'
  },
  { 
    id: '12', 
    employeeId: '2', 
    employeeName: 'Jane Smith', 
    department: 'Human Resources', 
    designation: 'HR Manager',
    date: '2025-05-06', 
    checkIn: '08:58:42', 
    inLocation: 'Main Office, Floor 1',
    checkOut: '17:05:15', 
    outLocation: 'Main Office, Floor 1',
    status: 'present',
    workingHours: '08:06:33'
  },
  { 
    id: '13', 
    employeeId: '3', 
    employeeName: 'Robert Johnson', 
    department: 'Finance', 
    designation: 'Financial Analyst',
    date: '2025-05-06', 
    checkIn: '08:45:00', 
    inLocation: 'Branch Office A',
    checkOut: '17:00:10', 
    outLocation: 'Branch Office A',
    status: 'present',
    workingHours: '08:15:10'
  },
  { 
    id: '14', 
    employeeId: '4', 
    employeeName: 'Emily Davis', 
    department: 'Marketing', 
    designation: 'Marketing Specialist',
    date: '2025-05-06', 
    checkIn: '09:17:22', 
    inLocation: 'Branch Office B',
    checkOut: '17:10:10', 
    outLocation: 'Branch Office B',
    status: 'late',
    workingHours: '07:52:48'
  },
  { 
    id: '15', 
    employeeId: '5', 
    employeeName: 'Michael Wilson', 
    department: 'IT', 
    designation: 'IT Support',
    date: '2025-05-06', 
    checkIn: null, 
    inLocation: null,
    checkOut: null, 
    outLocation: null,
    status: 'absent',
    workingHours: '00:00:00'
  }
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
