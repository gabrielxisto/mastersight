import { create } from 'zustand';
import type { Permissions } from '@/types';

type Company = {
  id: number;
  name: string;
  image: string;
  color: string;
  cnpj: string;
  permissions: Permissions;
  lastAccess?: number;
};

type CompaniesStore = {
  current: Company[];
  set: (current: Company[]) => void;
};

export const useCompaniesStore = create<CompaniesStore>((set) => ({
  current: [],
  set: (current: Company[]) => set({ current }),
}));