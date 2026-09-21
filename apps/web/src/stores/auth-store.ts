import { create } from 'zustand';
import { UserProfile } from '@career-clarity/shared-types';

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserProfile, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize from client storage if available
  const initialUser =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('career_clarity_user') || 'null')
      : null;
  const initialAccess =
    typeof window !== 'undefined' ? localStorage.getItem('career_clarity_access_token') : null;
  const initialRefresh =
    typeof window !== 'undefined' ? localStorage.getItem('career_clarity_refresh_token') : null;

  return {
    user: initialUser,
    accessToken: initialAccess,
    refreshToken: initialRefresh,
    isAuthenticated: !!initialAccess,

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
