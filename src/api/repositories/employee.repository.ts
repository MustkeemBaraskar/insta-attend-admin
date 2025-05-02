
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
  geofencing?: boolean;
  deletePermission?: boolean;
}

// Mock data for employees
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    position: 'Senior Developer',
    department: 'Engineering',
    joinDate: '2021-03-15',
    status: 'active',
    geofencing: true,
    deletePermission: false
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    position: 'HR Manager',
    department: 'Human Resources',
    joinDate: '2020-06-22',
    status: 'active',
    geofencing: false,
    deletePermission: true
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    phone: '(555) 456-7890',
    position: 'Financial Analyst',
    department: 'Finance',
    joinDate: '2022-01-10',
    status: 'inactive',
    geofencing: true,
    deletePermission: false
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '(555) 234-5678',
    position: 'Marketing Specialist',
    department: 'Marketing',
    joinDate: '2021-09-05',
    status: 'active',
    geofencing: true,
    deletePermission: true
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    phone: '(555) 876-5432',
    position: 'IT Support',
    department: 'IT',
    joinDate: '2022-03-28',
    status: 'active',
    geofencing: false,
    deletePermission: false
  }
];

export const employeeRepository = {
  getAll: () => {
    // Return mock data with a Promise to mimic API response
    return Promise.resolve({ data: mockEmployees });
  },
  
  getById: (id: string) => {
    const employee = mockEmployees.find(emp => emp.id === id);
    if (!employee) {
      return Promise.reject(new Error('Employee not found'));
    }
    return Promise.resolve({ data: employee });
  },
  
  create: (employee: Omit<Employee, 'id'>) => {
    // Create a new employee with a random ID
    const newEmployee: Employee = {
      ...employee,
      id: Math.random().toString(36).substring(2, 11),
    };
    
    // In a real implementation, we would add this to our mockEmployees array
    // But for testing purposes, we'll just return the new employee
    return Promise.resolve({ data: newEmployee });
  },
  
  update: (id: string, employee: Partial<Employee>) => {
    const existingIndex = mockEmployees.findIndex(emp => emp.id === id);
    if (existingIndex === -1) {
      return Promise.reject(new Error('Employee not found'));
    }
    
    // In a real implementation, we would update the mockEmployees array
    // But for testing purposes, we'll just return the updated employee
    const updatedEmployee = {
      ...mockEmployees[existingIndex],
      ...employee
    };
    
    return Promise.resolve({ data: updatedEmployee });
  },
  
  delete: (id: string) => {
    const existingIndex = mockEmployees.findIndex(emp => emp.id === id);
    if (existingIndex === -1) {
      return Promise.reject(new Error('Employee not found'));
    }
    
    // In a real implementation, we would remove from the mockEmployees array
    // But for testing purposes, we'll just return a success response
    return Promise.resolve({ data: undefined });
  },
};
