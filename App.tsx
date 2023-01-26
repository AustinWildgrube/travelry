import { View } from 'react-native';

import 'react-native-url-polyfill/auto';
import { NavigationContainer } from '@react-navigation/native';
import { TamaguiProvider } from 'tamagui';
import { useFonts } from 'expo-font';

import { ThemeProvider, useTheme, getNavigatorTheme } from 'src/themes';
import { AuthProvider, useAuth } from 'src/contexts/AuthProvider';
import { Layout, Spinner } from 'src/components';
import { AppNavigator } from 'src/navigators/AppNavigator';
import { AuthNavigator } from 'src/navigators/AuthNavigator';
import config from './tamagui.config';
import './src/translations/i18n';

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
          <Layout>
            <Root />
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
};

export default App;

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
      {currentUser !== null ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
