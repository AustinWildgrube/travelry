import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  useFonts,
} from '@expo-google-fonts/inter';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, SplashScreen } from 'expo-router';
import { ClickOutsideProvider } from 'react-native-click-outside';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GluestackUIProvider } from '&/components/core';
import { AuthProvider } from '&/contexts/Authentication';

import { config } from '&/gluestack-ui.config';

export const unstable_settings = {
  initialRouteName: '/(auth)/index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout(): JSX.Element | null {
  const queryClient = new QueryClient();

  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View onLayout={onLayoutRootView} style={styles.layoutContainer}>
      <QueryClientProvider client={queryClient}>
        <ClickOutsideProvider>
          <ActionSheetProvider>
            <GluestackUIProvider config={config.theme}>
              <AuthProvider>
                <SafeAreaProvider>
                  <BottomSheetModalProvider>
                    <Slot />
                  </BottomSheetModalProvider>
                </SafeAreaProvider>
              </AuthProvider>
            </GluestackUIProvider>
          </ActionSheetProvider>
        </ClickOutsideProvider>
      </QueryClientProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  layoutContainer: {
    flex: 1,
  },
});
