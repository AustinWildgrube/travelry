import { create } from 'zustand';

import { type UserProfile } from '&/queries/users';

export interface UserStore {
  viewedUser: UserProfile;
  setViewedUser: (user: UserProfile) => void;
}

export const useUserStore = create<UserStore>(set => ({
  viewedUser: {
    id: '1',
    username: 'commander_998',
    full_name: 'John Snow',
    avatar_url: '998.jpg',
    bio: 'I know nothing.',
    account_stat: {
      followers_count: 1000000,
      following_count: 1,
      trip_count: 2,
    },
  },
  setViewedUser: (user: UserProfile) => set({ viewedUser: user }),
}));
