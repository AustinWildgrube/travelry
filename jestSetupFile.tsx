import { ReactNode } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import { TamaguiProvider } from 'tamagui';

import { AuthContext } from '&/contexts/AuthProvider';
import { UserProfile } from '&/queries/users';
import { ThemeProvider } from '&/themes/ThemeProvider';

import config from './tamagui.config';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@expo/vector-icons', () => ({
  Feather: '',
}));

jest.mock('@env', () => ({
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',
  TAMAGUI_TARGET: 'native',
}));

export const wrapRender = (component: ReactNode): any => {
  let currentUser: UserProfile = {
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
