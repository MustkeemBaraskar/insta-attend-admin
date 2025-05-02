
import { apiClient } from '../apiClient';
import { apiUrl } from '../apiUrl';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const authRepository = {
  login: (credentials: LoginRequest) => {
    return apiClient.post<AuthResponse>(apiUrl.auth.login, credentials);
  },
  
  register: (userData: RegisterRequest) => {
    return apiClient.post<AuthResponse>(apiUrl.auth.register, userData);
  },
  
  forgotPassword: (data: ForgotPasswordRequest) => {
    return apiClient.post<{ message: string }>(apiUrl.auth.forgotPassword, data);
  },
  
  resetPassword: (data: ResetPasswordRequest) => {
    return apiClient.post<{ message: string }>(apiUrl.auth.resetPassword, data);
  },
};

