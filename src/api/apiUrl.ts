
const API_VERSION = 'v1';

export const apiUrl = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // Auth endpoints
  auth: {
    login: `/auth/login`,
    register: `/auth/register`,
    forgotPassword: `/auth/forgot-password`,
    resetPassword: `/auth/reset-password`,
  },
  
  // Employee endpoints
  employees: {
    getAll: `/employees`,
    getById: (id: string) => `/employees/${id}`,
    create: `/employees`,
    update: (id: string) => `/employees/${id}`,
    delete: (id: string) => `/employees/${id}`,
  },
  
  // Attendance endpoints
  attendance: {
    getAll: `/attendance`,
    getByEmployeeId: (id: string) => `/attendance/employee/${id}`,
    checkIn: `/attendance/check-in`,
    checkOut: `/attendance/check-out`,
    getReports: `/attendance/reports`,
  },
  
  // Leave management endpoints
  leave: {
    getAll: `/leave`,
    getById: (id: string) => `/leave/${id}`,
    create: `/leave`,
    update: (id: string) => `/leave/${id}`,
    approve: (id: string) => `/leave/${id}/approve`,
    reject: (id: string) => `/leave/${id}/reject`,
    getByEmployeeId: (id: string) => `/leave/employee/${id}`,
  },
  
  // Payroll endpoints
  payroll: {
    getAll: `/payroll`,
    generate: `/payroll/generate`,
    getById: (id: string) => `/payroll/${id}`,
    getByEmployeeId: (id: string) => `/payroll/employee/${id}`,
    downloadPayslip: (id: string) => `/payroll/${id}/download`,
  },
};

