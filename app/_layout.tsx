import 'react-native-url-polyfill/auto';
import { useEffect } from 'react';

import { Inter_400Regular, useFonts } from '@expo-google-fonts/inter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen, Stack } from 'expo-router';

import { AuthProvider } from '&/contexts/AuthProvider';

export default function RootLayout(): JSX.Element | null {
  const queryClient = new QueryClient();

  const [loaded, error] = useFonts({
    Inter_400Regular,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <>
      {!loaded ? (
        <SplashScreen />
      ) : (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }} />
          </AuthProvider>
        </QueryClientProvider>
      )}
    </>
  );
}
