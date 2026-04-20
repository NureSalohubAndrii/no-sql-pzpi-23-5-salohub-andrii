import { create } from 'zustand';

interface AuthState {
  pendingVerificationEmail: string | null;
  setPendingVerificationEmail: (email: string) => void;
  clearPendingVerificationEmail: () => void;

  pendingResetEmail: string | null;
  setPendingResetEmail: (email: string) => void;
  clearPendingResetEmail: () => void;

  accessToken: string | null;
  setAuth: (accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  pendingVerificationEmail: null,
  setPendingVerificationEmail: email => set({ pendingVerificationEmail: email }),
  clearPendingVerificationEmail: () => set({ pendingVerificationEmail: null }),

  pendingResetEmail: null,
  setPendingResetEmail: email => set({ pendingResetEmail: email }),
  clearPendingResetEmail: () => set({ pendingResetEmail: null }),

  accessToken: localStorage.getItem('token'),
  setAuth: accessToken => {
    localStorage.setItem('token', accessToken);
    set({ accessToken });
  },
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loginType');
    set({ accessToken: null });
  },
}));

export const { setAuth, clearAuth } = useAuthStore.getState();
