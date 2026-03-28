import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  decrementCredits: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  
  setUser: (user) => set({ user }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  decrementCredits: () => set((state) => {
    if (!state.user || state.user.isPro) return state;
    return {
      user: {
        ...state.user,
        credits: Math.max(0, state.user.credits - 1)
      }
    };
  })
}));
