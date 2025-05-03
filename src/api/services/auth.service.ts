
import { authRepository } from '../repositories/auth.repository';
import { toast } from 'sonner';

// Mock user data for testing
const MOCK_USER = {
  id: "1",
  name: "Admin User",
  email: "admin@insta-attend.com",
  role: "Administrator"
};

// Mock credentials for testing
const VALID_CREDENTIALS = {
  email: "admin@insta-attend.com",
  password: "password123"
};

export const authService = {
  login: async (email: string, password: string) => {
    try {
      // For mock testing, check if credentials match
      if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
        // Mock successful login
        const mockResponse = {
          token: "mock-jwt-token-for-testing",
          user: MOCK_USER
        };
        
        // Store token and user in localStorage
        localStorage.setItem('token', mockResponse.token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        
        return mockResponse;
      } else {
        // Mock failed login
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  },
  
  register: async (name: string, email: string, password: string, role: string) => {
    try {
      // Mock registration success
      toast.success('Registration successful!');
      return {
        token: "mock-jwt-token-for-testing",
        user: { id: "2", name, email, role }
      };
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw error;
    }
  },
  
  forgotPassword: async (email: string) => {
    try {
      // Mock forgot password success
      toast.success('Password reset email sent. Please check your inbox.');
      return { message: "Password reset email sent" };
    } catch (error) {
      toast.error('Failed to send password reset email. Please try again.');
      throw error;
    }
  },
  
  resetPassword: async (token: string, password: string) => {
    try {
      // Mock reset password success
      toast.success('Password reset successful. Please login with your new password.');
      return { message: "Password reset successful" };
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
