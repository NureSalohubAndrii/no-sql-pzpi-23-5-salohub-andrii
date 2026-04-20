import { ExpressHandler } from '../../shared/types/express.types';
import { handleError } from '../../shared/utils/error.utils';
import * as authService from './auth.service';

export const register: ExpressHandler = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      res.status(400).json({ message: 'Invalid email format' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters long' });
      return;
    }

    await authService.register({ fullName, email: normalizedEmail, password });

    res.status(201).json({
      message: 'Registration successful. Please check your email for verification code.',
      email: normalizedEmail,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const verifyEmail: ExpressHandler = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ message: 'Email and verification code are required' });
      return;
    }

    if (typeof email !== 'string' || typeof code !== 'string') {
      res.status(400).json({ message: 'Invalid data format' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedCode = code.trim();

    if (trimmedCode.length !== 4) {
      res.status(400).json({ message: 'Verification code must be 4 digits' });
      return;
    }

    if (!/^\d{4}$/.test(trimmedCode)) {
      res.status(400).json({ message: 'Verification code must contain only digits' });
      return;
    }

    await authService.verifyEmail(normalizedEmail, trimmedCode);

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    handleError(res, error);
  }
};

export const login: ExpressHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email, password and login type are required' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      res.status(400).json({ message: 'Invalid email format' });
      return;
    }

    const { accessToken, refreshToken } = await authService.login({
      email: normalizedEmail,
      password,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'Login successful', accessToken });
  } catch (error) {
    handleError(res, error);
  }
};

export const refreshTokens: ExpressHandler = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      res.status(401).json({ message: 'Missing refresh token' });
      return;
    }

    const { accessToken, refreshToken } = await authService.refreshTokens(token);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'Token refreshed successfully', accessToken });
  } catch (error) {
    handleError(res, error);
  }
};
