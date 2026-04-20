import { useMutation } from '@tanstack/react-query';
import { register, verifyEmail, login, verifyCode } from '@/api/auth.api';
import type {
  RegisterUserRequest,
  VerifyEmailRequest,
  LoginRequest,
  VerifyCodeRequest,
} from '@/types/auth.types';

export const useRegisterUserMutation = () =>
  useMutation({
    mutationFn: (data: RegisterUserRequest) => register(data),
  });

export const useVerifyEmailMutation = () =>
  useMutation({
    mutationFn: (data: VerifyEmailRequest) => verifyEmail(data),
  });

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (data: LoginRequest) => login(data),
  });

export const useVerifyCodeMutation = () =>
  useMutation({
    mutationFn: (data: VerifyCodeRequest) => verifyCode(data),
  });
