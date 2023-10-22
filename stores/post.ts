import { create } from 'zustand';

import { type Post } from '&/types/types';

type PostState = {
  viewedPost: Post | null;
  setViewedPost: (post: Post) => void;
};

export const usePostStore = create<PostState>(set => ({
  viewedPost: null,
  setViewedPost: (viewedPost: Post) => {
    set({ viewedPost });
  },
}));
