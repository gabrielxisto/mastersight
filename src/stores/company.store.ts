import { create } from 'zustand';
import type { Company } from '@/types';

type CompanyStore = {
  current: Company | false;
  set: (current: Company | false) => void;
};

export const useCompanyStore = create<CompanyStore>((set) => ({
  current: false,
  set: (current: Company | false) => set({ current }),
}));