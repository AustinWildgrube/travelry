import { Linking, Platform } from 'react-native';

import { ActivityAction, startActivityAsync } from 'expo-intent-launcher';

import { Button, Center, Heading, Text } from '&/components/core';

// TODO: once the camera is fixed check that this looks okay; it probably does not
export function Permissions(): JSX.Element {
  const openAppPref = (): void => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      startActivityAsync(ActivityAction.SECURITY_SETTINGS);
    }
  };

  return (
    <Center>
      <Heading>Travelry needs access to your camera</Heading>
      <Text>Click the button below to enable it</Text>

      <Button>
        <Button.Text onPress={openAppPref}>Open Settings</Button.Text>
      </Button>
    </Center>
  );
}
