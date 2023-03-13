import { ActivityIndicator, StyleSheet } from 'react-native';

export function LoadingIndicator(): JSX.Element {
  return <ActivityIndicator size="large" style={styles.indicator} />;
}

const styles = StyleSheet.create({
  indicator: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
