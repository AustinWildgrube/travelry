import { ReactNode, useEffect } from 'react';
import { Platform, SafeAreaView, StatusBar, StatusBarStyle, StyleSheet, View } from 'react-native';

import { useTheme } from 'src/themes';
import type { Theme } from 'src/themes';

export const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
  const { theme } = useTheme();
  const isAndroid = Platform.OS === 'android';

  if (isAndroid) {
    return (
      <View style={styles(theme).layoutAndroid}>
        <StatusBar />
        {children}
      </View>
    );
  }

  useEffect(() => {
    const statusBarStyle = theme.colors.statusBar as StatusBarStyle;
    StatusBar.setBarStyle(statusBarStyle);
  }, [theme]);

  return (
    <SafeAreaView style={styles(theme).layoutIOS}>
      <StatusBar />
      {children}
    </SafeAreaView>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    layoutAndroid: {
      backgroundColor: theme.colors.mainBackground,
      flex: 1,
      paddingTop: 25,
      paddingHorizontal: 12,
    },
    layoutIOS: {
      backgroundColor: theme.colors.mainBackground,
      flex: 1,
      paddingHorizontal: 12,
    },
  });
