import { create } from 'zustand';
import { UserProfile } from '@career-clarity/shared-types';

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  hydrateAuth: () => void;
  setAuth: (user: UserProfile, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  return {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    hasHydrated: false,

    hydrateAuth: () => {
      if (typeof window === 'undefined') return;

      try {
        const storedUser = localStorage.getItem('career_clarity_user');
        const storedAccess = localStorage.getItem('career_clarity_access_token');
        const storedRefresh = localStorage.getItem('career_clarity_refresh_token');

        const user: UserProfile | null = storedUser ? JSON.parse(storedUser) : null;

        set({
          user,
          accessToken: storedAccess,
          refreshToken: storedRefresh,
          isAuthenticated: !!storedAccess,
          hasHydrated: true,
        });
      } catch {
        set({ hasHydrated: true });
      }
    },

    setAuth: (user, accessToken, refreshToken) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('career_clarity_user', JSON.stringify(user));
        localStorage.setItem('career_clarity_access_token', accessToken);
        localStorage.setItem('career_clarity_refresh_token', refreshToken);
      }
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        hasHydrated: true,
      });
    },

    clearAuth: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('career_clarity_user');
        localStorage.removeItem('career_clarity_access_token');
        localStorage.removeItem('career_clarity_refresh_token');
      }
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        hasHydrated: true,
      });
    },

    updateUser: (data) => {
      set((state) => {
        if (!state.user) return state;
        const updated = { ...state.user, ...data };
        if (typeof window !== 'undefined') {
          localStorage.setItem('career_clarity_user', JSON.stringify(updated));
        }
        return { user: updated };
      });
    },
  };
});
