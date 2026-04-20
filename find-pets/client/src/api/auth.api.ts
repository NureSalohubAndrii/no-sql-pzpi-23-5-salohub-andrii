import { apiRequest } from '@/api/client';
import type {
  RegisterUserRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  RefreshResponse,
} from '@/types/auth.types';

export const register = (data: RegisterUserRequest) => {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const verifyEmail = (data: VerifyEmailRequest) => {
  return apiRequest<VerifyEmailResponse>('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const login = (data: LoginRequest) =>
  apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const verifyCode = (data: VerifyCodeRequest) =>
  apiRequest<VerifyCodeResponse>('/auth/verify-code', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const refreshToken = () =>
  apiRequest<RefreshResponse>('/auth/refresh', {
    method: 'POST',
  });
