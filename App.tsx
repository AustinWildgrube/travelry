import { View } from 'react-native';

import 'react-native-url-polyfill/auto';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { TamaguiProvider } from 'tamagui';

import { Spinner } from '&/components/atoms';
import { AuthProvider, useAuth } from '&/contexts/AuthProvider';
import { AuthNavigator } from '&/navigators/auth-navigator';
import { RootNavigator } from '&/navigators/root-navigator';
import { ThemeProvider, useTheme } from '&/themes/ThemeProvider';
import { getNavigatorTheme } from '&/themes/navigator-theme';

import config from './tamagui.config';

const App = (): JSX.Element | null => {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const queryClient = new QueryClient();

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={config}>
        <ThemeProvider>
          <AuthProvider>
            <Root />
          </AuthProvider>
        </ThemeProvider>
      </TamaguiProvider>
    </QueryClientProvider>
  );
};

const Root = () => {
  const { theme } = useTheme();
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <View>
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={getNavigatorTheme(theme)}>
      {currentUser !== null ? <RootNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default App;
