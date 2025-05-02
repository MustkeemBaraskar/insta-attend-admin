
import { payrollRepository, Payroll, GeneratePayrollRequest } from '../repositories/payroll.repository';
import { toast } from 'sonner';

export const payrollService = {
  getAllPayrolls: async (month?: string, year?: number, status?: string) => {
    try {
      const response = await payrollRepository.getAll({ month, year, status });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch payroll records.');
      throw error;
    }
  },
  
  generatePayroll: async (month: string, year: number) => {
    try {
      const response = await payrollRepository.generate({ month, year });
      toast.success('Payroll generated successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to generate payroll.');
      throw error;
    }
  },
  
  getPayrollById: async (id: string) => {
    try {
      const response = await payrollRepository.getById(id);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch payroll details.');
      throw error;
    }
  },
  
  getPayrollsByEmployeeId: async (employeeId: string, year?: number) => {
    try {
      const response = await payrollRepository.getByEmployeeId(employeeId, { year });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch employee payroll records.');
      throw error;
    }
  },
  
  downloadPayslip: async (id: string) => {
    try {
      const response = await payrollRepository.downloadPayslip(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payslip-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (error) {
      toast.error('Failed to download payslip.');
      throw error;
    }
  },
};

