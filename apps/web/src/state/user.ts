import { components } from '@/lib/api/types';
import { create } from 'zustand';

export interface UserState {
  user?: components['schemas']['UserEntity'];
  setUser: (user: UserState['user']) => void;
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
