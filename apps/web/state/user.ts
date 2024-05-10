import { create } from "zustand";

export interface UserState {
  user?: {
    id: string;
    name: string;
    username: string;
  };
  setUser: (user: UserState["user"]) => void;
  logOut: () => void;
}

export const useUser = create<UserState>((set) => ({
  user: undefined,
  setUser(user) {
    set({ user });
  },
  logOut() {
    set({ user: undefined });
  },
}));
