
import { employeeRepository, Employee } from '../repositories/employee.repository';
import { toast } from 'sonner';

export const employeeService = {
  getAllEmployees: async () => {
    try {
      const response = await employeeRepository.getAll();
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch employees.');
      throw error;
    }
  },
  
  getEmployeeById: async (id: string) => {
    try {
      const response = await employeeRepository.getById(id);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch employee details.');
      throw error;
    }
  },
  
  createEmployee: async (employee: Omit<Employee, 'id'>) => {
    try {
      const response = await employeeRepository.create(employee);
      toast.success('Employee created successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to create employee.');
      throw error;
    }
  },
  
  updateEmployee: async (id: string, employee: Partial<Employee>) => {
    try {
      const response = await employeeRepository.update(id, employee);
      toast.success('Employee updated successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to update employee.');
      throw error;
    }
  },
  
  deleteEmployee: async (id: string) => {
    try {
      await employeeRepository.delete(id);
      toast.success('Employee deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete employee.');
      throw error;
    }
  },
};
