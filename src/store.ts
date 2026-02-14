import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "admin" | "user";

interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

const useTokenStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setAuth: (token, user) =>
        set({
          token,
          user,
        }),

      logout: () =>
        set({
          token: null,
          user: null,
        }),
    }),
    {
      name: "auth-store", // 👈 same key jo DevTools me dikh raha
    }
  )
);

export default useTokenStore;
