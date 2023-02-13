import { create } from 'zustand';

import { type Album } from '&/queries/albums';

export interface AlbumStore {
  viewedAlbum: Album;
  setViewedAlbum: (user: Album) => void;
}

export const useAlbumStore = create<AlbumStore>(set => ({
  viewedAlbum: {
    id: '',
    name: '',
    cover: {
      file_url: '',
    },
  },
  setViewedAlbum: (album: Album) => set({ viewedAlbum: album }),
}));
