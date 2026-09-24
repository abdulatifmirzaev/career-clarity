import { create } from 'zustand';
import { UserProfile } from '@career-clarity/shared-types';

const DEFAULT_GUEST_USER: UserProfile = {
  id: 'guest-user',
  email: 'guest@career-clarity.dev',
  name: null,
  yearsExp: 4,
  primaryStack: 'Full-Stack Engineering (React, Node.js, Cloud System Architecture)',
  createdAt: new Date().toISOString(),
};

const DEFAULT_GUEST_TOKEN = 'guest_instant_access_token_2026';

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
    user: DEFAULT_GUEST_USER,
    accessToken: DEFAULT_GUEST_TOKEN,
    refreshToken: DEFAULT_GUEST_TOKEN,
    isAuthenticated: true,
    hasHydrated: false,

    hydrateAuth: () => {
      if (typeof window === 'undefined') return;

      try {
        const storedUser = localStorage.getItem('career_clarity_user');
        const storedAccess = localStorage.getItem('career_clarity_access_token');
        const storedRefresh = localStorage.getItem('career_clarity_refresh_token');

        const user: UserProfile = storedUser ? JSON.parse(storedUser) : DEFAULT_GUEST_USER;
        const accessToken = storedAccess || DEFAULT_GUEST_TOKEN;
        const refreshToken = storedRefresh || DEFAULT_GUEST_TOKEN;

        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          hasHydrated: true,
        });
      } catch {
        set({
          user: DEFAULT_GUEST_USER,
          accessToken: DEFAULT_GUEST_TOKEN,
          refreshToken: DEFAULT_GUEST_TOKEN,
          isAuthenticated: true,
          hasHydrated: true,
        });
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
      // Re-initialize with default guest session
      set({
        user: DEFAULT_GUEST_USER,
        accessToken: DEFAULT_GUEST_TOKEN,
        refreshToken: DEFAULT_GUEST_TOKEN,
        isAuthenticated: true,
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
