import { ReactNode } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps): JSX.Element {
  const isAndroid = Platform.OS === 'android';

  if (isAndroid) {
    return (
      <View style={styles.layoutAndroid}>
        <StatusBar />
        {children}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.layoutIOS}>
      <StatusBar />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layoutAndroid: {
    backgroundColor: '#fff',
    flex: 1,
    marginTop: 25,
    marginHorizontal: 12,
  },
  layoutIOS: {
    backgroundColor: '#fff',
    flex: 1,
    marginTop: 21,
    marginHorizontal: 12,
  },
});
