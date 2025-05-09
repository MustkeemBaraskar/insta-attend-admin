
import { authRepository } from '../repositories/auth.repository';
import { toast } from 'sonner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const authService = {
  login: async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      // For our mock implementation, we'll accept some test credentials
      if (email === 'admin@insta-attend.com' && password === 'password123') {
        const user = {
          id: 'admin-1',
          name: 'Admin User',
          email: email,
          role: 'Administrator',
        };
        
        // Store the user in local storage
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('mockUser', JSON.stringify(user));
        
        return user;
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('mockUser');
  },
  
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('mockUser');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
  
  isAuthenticated: (): boolean => {
    return localStorage.getItem('token') !== null;
  },
  
  forgotPassword: async (email: string) => {
    // In a real app, this would call an API to send password reset email
    // For mock, we'll just return success
    toast.success(`Password reset link sent to ${email}`);
    return { success: true };
  },
  
  resetPassword: async (token: string, password: string) => {
    // In a real app, this would verify the token and update the password
    // For mock, we'll just return success
    toast.success('Password reset successful');
    return { success: true };
  },
};
