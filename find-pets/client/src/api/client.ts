import { clearAuth, setAuth } from '@/store/auth.store';

const BASE_URL = import.meta.env.VITE_API_URL as string;

export const apiRequest = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const { headers, ...rest } = options;
  const token = localStorage.getItem('token');

  const makeRequest = (currentToken: string | null) =>
    fetch(`${BASE_URL}${path}`, {
      ...rest,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
        ...(headers as Record<string, string>),
      },
    });

  let response = await makeRequest(token);

  if (response.status === 401 && path !== '/auth/login' && path !== '/auth/refresh') {
    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshRes.ok) {
        const { accessToken } = await refreshRes.json();
        localStorage.setItem('token', accessToken);
        setAuth(accessToken);

        response = await makeRequest(accessToken);
      } else {
        clearAuth();
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
    } catch (err) {
      throw new Error('Authentication failed');
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.message || `Request failed with status ${response.status}`;

    console.error(`[API Error] ${path}:`, {
      status: response.status,
      message: errorMessage,
      data,
    });

    throw new Error(errorMessage);
  }

  return data as T;
};
