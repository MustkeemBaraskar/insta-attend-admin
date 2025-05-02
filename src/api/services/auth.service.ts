
import { authRepository } from '../repositories/auth.repository';
import { toast } from 'sonner';

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await authRepository.login({ email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  },
  
  register: async (name: string, email: string, password: string, role: string) => {
    try {
      const response = await authRepository.register({ name, email, password, role });
      toast.success('Registration successful!');
      return response.data;
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw error;
    }
  },
  
  forgotPassword: async (email: string) => {
    try {
      const response = await authRepository.forgotPassword({ email });
      toast.success('Password reset email sent. Please check your inbox.');
      return response.data;
    } catch (error) {
      toast.error('Failed to send password reset email. Please try again.');
      throw error;
    }
  },
  
  resetPassword: async (token: string, password: string) => {
    try {
      const response = await authRepository.resetPassword({ token, password });
      toast.success('Password reset successful. Please login with your new password.');
      return response.data;
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

