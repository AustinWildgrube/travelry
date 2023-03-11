import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { ActivityAction, startActivityAsync } from 'expo-intent-launcher';

export function Permissions(): JSX.Element {
  const openAppPref = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      startActivityAsync(ActivityAction.SECURITY_SETTINGS);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Travelry needs access to your camera</Text>
      <Text style={styles.subTitle}>Click the button below enable it</Text>
      <Pressable onPress={() => openAppPref()} style={styles.settingsButton}>
        <Text style={styles.settingsButtonText}>Open Settings</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    bottom: 0,
    justifyContent: 'center',
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  title: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '600',
    textAlign: 'center',
  },
  subTitle: {
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
  },
  settingsButton: {
    alignItems: 'center',
    backgroundColor: '#e63946',
    borderRadius: 3,
    justifyContent: 'center',
    marginTop: 32,
    padding: 16,
    width: '50%',
  },
  settingsButtonText: {
    color: '#fff',
  },
});
