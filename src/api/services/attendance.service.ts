
import { attendanceRepository, Attendance, CheckInRequest, CheckOutRequest } from '../repositories/attendance.repository';
import { toast } from 'sonner';

export const attendanceService = {
  getAllAttendance: async (startDate?: string, endDate?: string) => {
    try {
      const response = await attendanceRepository.getAll({ startDate, endDate });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch attendance records.');
      throw error;
    }
  },
  
  getAttendanceByEmployeeId: async (employeeId: string, startDate?: string, endDate?: string) => {
    try {
      const response = await attendanceRepository.getByEmployeeId(employeeId, { startDate, endDate });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch employee attendance records.');
      throw error;
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

