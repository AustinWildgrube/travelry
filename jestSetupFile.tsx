import { ReactNode } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react-native';

import '@testing-library/jest-native/extend-expect';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import { AuthContext } from '&/contexts/AuthProvider';
import { type Album } from '&/queries/albums';
import { type Post } from '&/queries/posts';
import { type UserProfile } from '&/queries/users';
import { ThemeProvider } from '&/themes/ThemeProvider';

// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
//
// jest.mock('@react-native-async-storage/async-storage', () =>
//   require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
// );
//
// jest.mock('@expo/vector-icons', () => ({
//   Feather: '',
// }));
//
// jest.mock('@env', () => ({
//   SUPABASE_URL: '',
//   SUPABASE_ANON_KEY: '',
// }));

export const currentUser: UserProfile = {
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
};

export const otherUser: UserProfile = {
  id: '2',
  username: 'FreeFolk',
  full_name: 'Ygritte',
  avatar_url: '234.jpg',
  bio: 'You know nothing John Snow.',
  account_stat: {
    followers_count: 0,
    following_count: 0,
    trip_count: 1,
  },
};

export const currentUserPosts: Post[] = [
  {
    id: '0',
    caption: 'The dreadful Castle Black.',
    location: 'Castle Black',
    created_at: '2021-12-24T00:00:00',
    account: currentUser,
    post_stat: {
      id: '',
      likes_count: '21',
    },
    post_media: [
      {
        id: 'b81ad645-7155-45f6-bd2e-ca56786dd331',
        file_url: '0.21339742357972857.jpg',
      },
    ],
  },
  {
    id: '0',
    caption: 'Why does Catelyn Stark hate me?',
    location: 'Winterfell',
    created_at: '2021-12-24T00:00:00',
    account: currentUser,
    post_stat: {
      id: '',
      likes_count: '123',
    },
    post_media: [
      {
        id: '76cb79cf-be8a-4416-9d15-b1356b38259a',
        file_url: '0.37365145619157225.jpg',
      },
    ],
  },
];

export const currentUserAlbums: Album[] = [
  {
    id: '0',
    name: 'Beyond The Wall',
    cover: {
      file_url: '0.37365142347572250.jpg',
    },
  },
];

export const wrapRender = (component: ReactNode): any => {
  const queryClient = new QueryClient();

  let loginWithEmailAndPassword = async (): Promise<void> => {
    return undefined;
  };

  let registerWithEmailAndPassword = async (): Promise<void> => {
    return undefined;
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthContext.Provider value={{ currentUser, loginWithEmailAndPassword, registerWithEmailAndPassword }}>
          <NavigationContainer>{component}</NavigationContainer>
        </AuthContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>,
  );
};
