import {
  RegisterInput,
  RegisterResult,
  LoginInput,
  LoginResult,
  RefreshTokenInput,
  RefreshTokenResult,
} from './types/auth.types';
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  generateVerificationCode,
  hashPassword,
  verifyToken,
} from '../../shared/utils/auth.utils';
import { sendVerificationEmail } from '../email/email.service';
import User from '../../database/models/user.model';
import VerificationCode from '../../database/models/verification-code.model';
import { AppError } from '../../shared/utils/error.utils';

export const register = async ({
  fullName,
  email,
  password,
}: RegisterInput): Promise<RegisterResult> => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.isEmailVerified) {
      throw new AppError('User already exists', 409);
    }

    await VerificationCode.deleteOne({ userId: existingUser._id });
    await User.deleteOne({ _id: existingUser._id });
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

  await VerificationCode.create({
    userId: user._id,
    code,
    expiresAt,
  });

  await sendVerificationEmail(email, code);

  console.log(`Code for user ${user._id}: ${code}`);

  return { userId: user._id.toString() };
};

export const verifyEmail = async (email: string, code: string): Promise<void> => {
  if (!code || typeof code !== 'string' || code.length !== 4) {
    throw new Error('Invalid code format');
  }

  console.log(`Verifying code: ${code}`);

  const user = await User.findOne({ email }).select('_id isEmailVerified');

  if (!user) {
    console.log(`User not found for email: ${email}`);
    throw new AppError('User not found', 404);
  }

  if (user.isEmailVerified) {
    console.log(`Email already verified for user: ${user._id}`);
    throw new AppError('Email already verified', 409);
  }

  const verificationRecord = await VerificationCode.findOne({
    userId: user._id,
    code,
    expiresAt: {
      $gt: new Date(),
    },
  });

  if (!verificationRecord) {
    console.log(`Invalid or expired code for user: ${user._id}`);
    throw new AppError('Invalid or expired verification code', 400);
  }

  await User.updateOne({ _id: user._id }, { isEmailVerified: true });
  await VerificationCode.deleteOne({ userId: user._id });

  console.log(`Email verified successfully for user: ${user._id}`);
};

export const login = async ({ email, password }: LoginInput): Promise<LoginResult> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError('User not found', 404);
  }
  if (!user.isEmailVerified) {
    throw new AppError('Please verify your email', 403);
  }

  const match = await comparePassword(password, user.password ?? '');
  if (!match) {
    throw new AppError('Incorrect password', 401);
  }

  const accessToken = generateAccessToken(user._id.toString(), email);
  const refreshToken = generateRefreshToken(user._id.toString());

  return { accessToken, refreshToken };
};

export const refreshTokens = async (refreshToken: string): Promise<RefreshTokenResult> => {
  const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!);
  if (!decoded || typeof decoded === 'string') {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const { userId } = decoded as { userId: string };
  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new AppError('User or establishment not found', 404);
  }

  const accessToken = generateAccessToken(userId, user.email);
  const newRefreshToken = generateRefreshToken(userId);

  return { accessToken, refreshToken: newRefreshToken };
};
