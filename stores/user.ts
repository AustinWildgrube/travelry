import { create } from 'zustand';

import { type User, type UserStat } from '&/types/types';

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
  updateUserStats: (stats: UserStat) => void;
};

export const useUserStore = create<UserState>(set => ({
  user: null,
  setUser: (user: User) => {
    set({ user });
  },
  updateUserStats: (stats: UserStat) => {
    set(state => ({
      user: state.user
        ? {
            ...state.user,
            account_stat: {
              ...state.user.account_stat,
              ...stats,
            },
          }
        : null,
    }));
  },
}));
