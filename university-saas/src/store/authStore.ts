import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  firebaseUser: { uid: string; email: string | null } | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setFirebaseUser: (fu: { uid: string; email: string | null } | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      firebaseUser: null,
      loading: true,
      setUser: (user) => set({ user }),
      setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
      setLoading: (loading) => set({ loading }),
      logout: () => set({ user: null, firebaseUser: null }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
