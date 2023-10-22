import { create } from 'zustand';

type SignatureState = {
  token: string | null;
  fetchedAt: number | null;
  setToken: (token: string) => void;
  setFetchedAt: (fetchedAt: number) => void;
  isExpired: () => boolean;
};

export const useSignatureStore = create<SignatureState>((set, get) => ({
  token: null,
  fetchedAt: null,

  setToken: (token: string) => {
    set({ token });
    set({ fetchedAt: Date.now() });
  },

  setFetchedAt: (fetchedAt: number) => {
    set({ fetchedAt });
  },

  isExpired: () => {
    const fetchedAt = get().fetchedAt;
    if (!fetchedAt) return true;

    const diffInSeconds = Math.floor((Date.now() - fetchedAt) / 60000);
    return diffInSeconds >= 1;
  },
}));
