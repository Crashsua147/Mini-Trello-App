import { create } from 'zustand';

export const useUserStore = create((set) => ({
  userModel: null,
  setUserModel: (user) => set({ userModel: user }),
}));