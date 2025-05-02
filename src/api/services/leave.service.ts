
import { leaveRepository, Leave, LeaveRequest, LeaveApprovalRequest, LeaveRejectionRequest } from '../repositories/leave.repository';
import { toast } from 'sonner';

export const leaveService = {
  getAllLeaves: async (status?: string, startDate?: string, endDate?: string) => {
    try {
      const response = await leaveRepository.getAll({ status, startDate, endDate });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch leave records.');
      throw error;
    }
  },
  
  getLeaveById: async (id: string) => {
    try {
      const response = await leaveRepository.getById(id);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch leave details.');
      throw error;
    }
  },
  
  createLeaveRequest: async (leaveRequest: LeaveRequest) => {
    try {
      const response = await leaveRepository.create(leaveRequest);
      toast.success('Leave request submitted successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to submit leave request.');
      throw error;
    }
  },
  
  updateLeaveRequest: async (id: string, leaveRequest: Partial<LeaveRequest>) => {
    try {
      const response = await leaveRepository.update(id, leaveRequest);
      toast.success('Leave request updated successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to update leave request.');
      throw error;
    }
  },
  
  approveLeave: async (id: string, data: LeaveApprovalRequest) => {
    try {
      const response = await leaveRepository.approve(id, data);
      toast.success('Leave request approved!');
      return response.data;
    } catch (error) {
      toast.error('Failed to approve leave request.');
      throw error;
    }
  },
  
  rejectLeave: async (id: string, data: LeaveRejectionRequest) => {
    try {
      const response = await leaveRepository.reject(id, data);
      toast.success('Leave request rejected.');
      return response.data;
    } catch (error) {
      toast.error('Failed to reject leave request.');
      throw error;
    }
  },
  
  getLeavesByEmployeeId: async (employeeId: string, status?: string) => {
    try {
      const response = await leaveRepository.getByEmployeeId(employeeId, { status });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch employee leave records.');
      throw error;
    }
  },
};

