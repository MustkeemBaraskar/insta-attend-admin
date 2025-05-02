
import { apiClient } from '../apiClient';
import { apiUrl } from '../apiUrl';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  joinDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export const employeeRepository = {
  getAll: () => {
    return apiClient.get<Employee[]>(apiUrl.employees.getAll);
  },
  
  getById: (id: string) => {
    return apiClient.get<Employee>(apiUrl.employees.getById(id));
  },
  
  create: (employee: Omit<Employee, 'id'>) => {
    return apiClient.post<Employee>(apiUrl.employees.create, employee);
  },
  
  update: (id: string, employee: Partial<Employee>) => {
    return apiClient.put<Employee>(apiUrl.employees.update(id), employee);
  },
  
  delete: (id: string) => {
    return apiClient.delete<void>(apiUrl.employees.delete(id));
  },
};

