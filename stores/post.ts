import { create } from 'zustand';

import { type Post } from '&/queries/posts';

export interface PostStore {
  viewedPost: Post | null;
  imageUploadUri: string | null;
  setViewedPost: (post: Post) => void;
  setImageUploadUri: (imageUri: string) => void;
}

export const usePostStore = create<PostStore>(set => ({
  viewedPost: null,
  imageUploadUri: null,
  setViewedPost: (post: Post) => set({ viewedPost: post }),
  setImageUploadUri: (imageUri: string) => set({ imageUploadUri: imageUri }),
}));
