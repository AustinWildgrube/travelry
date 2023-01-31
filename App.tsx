import { View } from 'react-native';

import 'react-native-url-polyfill/auto';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { TamaguiProvider } from 'tamagui';

import { Spinner } from '&/components/atoms';
import { AuthProvider, useAuth } from '&/contexts/AuthProvider';
import { RootNavigator } from '&/navigators/app-navigator';
import { AuthNavigator } from '&/navigators/auth-navigator';
import { ThemeProvider, useTheme } from '&/themes/ThemeProvider';
import { getNavigatorTheme } from '&/themes/navigator-theme';

import config from './tamagui.config';

const App = (): JSX.Element | null => {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <ThemeProvider>
        <AuthProvider>
          <Root />
        </AuthProvider>
      </ThemeProvider>
    </TamaguiProvider>
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
