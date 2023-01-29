import { ReactNode } from 'react';

import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { TamaguiProvider } from 'tamagui';

import { UserProfile } from './src/queries/users';
import { ThemeProvider } from './src/themes';
import { AuthContext } from './src/contexts/AuthProvider';
import config from './tamagui.config';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@env', () => ({
  SUPABASE_URL: 'https://xilfwzpwcchiivwulkbn.supabase.co',
  SUPABASE_ANON_KEY:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpbGZ3enB3Y2NoaWl2d3Vsa2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI3NzAxMDIsImV4cCI6MTk3ODM0NjEwMn0.VXtG9yNLcLDMNaKMyOuVs_ePtMIzVrswVD71Okw24NI',
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

  return render(
    <TamaguiProvider config={config}>
      <ThemeProvider>
        <AuthContext.Provider value={{ currentUser }}>
          <NavigationContainer>{component}</NavigationContainer>
        </AuthContext.Provider>
      </ThemeProvider>
    </TamaguiProvider>,
  );
};
