
import { apiClient } from '../apiClient';
import { apiUrl } from '../apiUrl';

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  paymentStatus: 'pending' | 'paid';
  paymentDate?: string;
}

export interface GeneratePayrollRequest {
  month: string;
  year: number;
}

export const payrollRepository = {
  getAll: (params?: { month?: string; year?: number; status?: string }) => {
    return apiClient.get<Payroll[]>(apiUrl.payroll.getAll, { params });
  },
  
  generate: (data: GeneratePayrollRequest) => {
    return apiClient.post<Payroll[]>(apiUrl.payroll.generate, data);
  },
  
  getById: (id: string) => {
    return apiClient.get<Payroll>(apiUrl.payroll.getById(id));
  },
  
  getByEmployeeId: (employeeId: string, params?: { year?: number }) => {
    return apiClient.get<Payroll[]>(apiUrl.payroll.getByEmployeeId(employeeId), { params });
  },
  
  downloadPayslip: (id: string) => {
    return apiClient.get<Blob>(apiUrl.payroll.downloadPayslip(id), {
      responseType: 'blob' as any,
    });
  },
};

