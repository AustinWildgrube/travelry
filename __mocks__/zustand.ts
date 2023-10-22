import { act } from '@testing-library/react-native';
import { StateCreator } from 'zustand';

import { useUserStore } from '&/stores/user';
import { type User } from '&/types/types';

const { create: actualCreate } = jest.requireActual('zustand');
const storeResetFns = new Set<() => void>();

export const mockUser: User = {
  id: '1',
  username: '',
  first_name: '',
  last_name: '',
  avatar_url: '',
  avatar_placeholder: '',
  is_following: false,
  bio: '',
  account_stat: {
    followers_count: 0,
    following_count: 0,
    trip_count: 0,
  },
  album: [
    {
      id: '',
      name: '',
      cover: '',
      cover_placeholder: '',
      post_count: 0,
    },
  ],
};

export const create = <S>(createState: StateCreator<S>) => {
  const store = actualCreate(createState);
  const initialState = store.getState();

  storeResetFns.add(() => {
    store.setState(initialState, true);
  });

  return store;
};

beforeEach(async () => {
  await act(() => {
    storeResetFns.forEach(resetFn => {
      resetFn();
    });

    useUserStore.setState({ setUser: undefined, updateUserStats: undefined, user: mockUser });
  });
});
