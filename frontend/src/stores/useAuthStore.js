import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const AUTH_STORAGE_KEY = "intertrack-auth"

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      user: null,

      setAccessToken: (accessToken) => set({ accessToken }),
      setUser: (user) => set({ user }),
      clearAccessToken: () => set({ accessToken: null, user: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken, user: state.user }),
    }
  )
)