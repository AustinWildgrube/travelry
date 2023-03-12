import { Stack } from 'expo-router';

import { Camera } from '&/components/camera';

export default function Kinematograph(): JSX.Element {
  return (
    <>
      <Camera />
      <Stack.Screen options={{ headerShown: false }} />
    </>
  );
}
