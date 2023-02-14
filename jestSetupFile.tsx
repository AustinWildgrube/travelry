import { ReactNode } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import { TamaguiProvider } from 'tamagui';

import '@testing-library/jest-native/extend-expect';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import { AuthContext } from '&/contexts/AuthProvider';
import { type Album } from '&/queries/albums';
import { type Post } from '&/queries/posts';
import { type UserProfile } from '&/queries/users';
import { ThemeProvider } from '&/themes/ThemeProvider';

import config from './tamagui.config';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@expo/vector-icons', () => ({
  Feather: '',
}));

jest.mock('zustand');

jest.mock('@env', () => ({
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',
  TAMAGUI_TARGET: 'native',
}));

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

export const currentUserPosts: Post[] = [
  {
    caption: 'The dreadful Castle Black.',
    location: 'Castle Black',
    created_at: '2021-12-24T00:00:00',
    account: currentUser,
    post_media: [
      {
        id: 'b81ad645-7155-45f6-bd2e-ca56786dd331',
        file_url: '0.21339742357972857.jpg',
      },
    ],
  },
  {
    caption: 'Why does Catelyn Stark hate me?',
    location: 'Winterfell',
    created_at: '2021-12-24T00:00:00',
    account: currentUser,
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
  let loginWithEmailAndPassword = async (): Promise<void> => {
    return undefined;
  };

  let registerWithEmailAndPassword = async (): Promise<void> => {
    return undefined;
  };

  return render(
    <TamaguiProvider config={config}>
      <ThemeProvider>
        <AuthContext.Provider value={{ currentUser, loginWithEmailAndPassword, registerWithEmailAndPassword }}>
          <NavigationContainer>{component}</NavigationContainer>
        </AuthContext.Provider>
      </ThemeProvider>
    </TamaguiProvider>,
  );
};
