import { create } from 'zustand';

export enum FollowListType {
  Following = 0,
  Followers = 1,
}

type FollowState = {
  viewedList: FollowListType;
  setViewedList: (post: FollowListType) => void;
};

export const useFollowStore = create<FollowState>(set => ({
  viewedList: FollowListType.Following,
  setViewedList: (viewedList: FollowListType) => {
    set({ viewedList });
  },
}));
