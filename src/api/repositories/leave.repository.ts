
import { apiClient } from '../apiClient';
import { apiUrl } from '../apiUrl';

export interface Leave {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'Sick Leave' | 'Vacation' | 'Personal Leave' | 'Other';
  startDate: string;
  endDate: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
  appliedOn: string;
  approvedBy?: string;
  rejectedReason?: string;
}

export interface LeaveRequest {
  employeeId: string;
  type: 'Sick Leave' | 'Vacation' | 'Personal Leave' | 'Other';
  startDate: string;
  endDate: string;
  reason: string;
}

export interface LeaveApprovalRequest {
  approvedBy: string;
}

export interface LeaveRejectionRequest {
  rejectedBy: string;
  rejectedReason: string;
}

export const leaveRepository = {
  getAll: (params?: { status?: string; startDate?: string; endDate?: string }) => {
    return apiClient.get<Leave[]>(apiUrl.leave.getAll, { params });
  },
  
  getById: (id: string) => {
    return apiClient.get<Leave>(apiUrl.leave.getById(id));
  },
  
  create: (leaveRequest: LeaveRequest) => {
    return apiClient.post<Leave>(apiUrl.leave.create, leaveRequest);
  },
  
  update: (id: string, leaveRequest: Partial<LeaveRequest>) => {
    return apiClient.put<Leave>(apiUrl.leave.update(id), leaveRequest);
  },
  
  approve: (id: string, data: LeaveApprovalRequest) => {
    return apiClient.post<Leave>(apiUrl.leave.approve(id), data);
  },
  
  reject: (id: string, data: LeaveRejectionRequest) => {
    return apiClient.post<Leave>(apiUrl.leave.reject(id), data);
  },
  
  getByEmployeeId: (employeeId: string, params?: { status?: string }) => {
    return apiClient.get<Leave[]>(apiUrl.leave.getByEmployeeId(employeeId), { params });
  },
};

