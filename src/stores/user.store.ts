import { create } from "zustand";
import type { User } from "@/types";

type UserStore = {
  current: User | null;
  set: (current: User | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  current: null,
  set: (current: User | null) => set({ current }),
}));
