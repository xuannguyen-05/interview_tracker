import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const AUTH_STORAGE_KEY = "intertrack-auth";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      clearAuth: () => set({ user: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);