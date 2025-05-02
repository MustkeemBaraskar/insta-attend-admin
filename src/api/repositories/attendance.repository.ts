
import { apiClient } from '../apiClient';
import { apiUrl } from '../apiUrl';

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: 'present' | 'absent' | 'late' | 'half-day';
  workingHours?: number;
}

export interface CheckInRequest {
  employeeId: string;
  latitude?: number;
  longitude?: number;
}

export interface CheckOutRequest {
  employeeId: string;
  latitude?: number;
  longitude?: number;
}

export interface AttendanceReport {
  present: number;
  absent: number;
  late: number;
  total: number;
  averageWorkingHours: number;
  byDate: {
    date: string;
    present: number;
    absent: number;
    late: number;
  }[];
}

export const attendanceRepository = {
  getAll: (params?: { startDate?: string; endDate?: string }) => {
    return apiClient.get<Attendance[]>(apiUrl.attendance.getAll, { params });
  },
  
  getByEmployeeId: (employeeId: string, params?: { startDate?: string; endDate?: string }) => {
    return apiClient.get<Attendance[]>(apiUrl.attendance.getByEmployeeId(employeeId), { params });
  },
  
  checkIn: (data: CheckInRequest) => {
    return apiClient.post<Attendance>(apiUrl.attendance.checkIn, data);
  },
  
  checkOut: (data: CheckOutRequest) => {
    return apiClient.post<Attendance>(apiUrl.attendance.checkOut, data);
  },
  
  getReports: (params: { startDate: string; endDate: string }) => {
    return apiClient.get<AttendanceReport>(apiUrl.attendance.getReports, { params });
  },
};

