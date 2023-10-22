import { Fragment } from 'react';

import { Stack } from 'expo-router';

import CreateConversation from '&/components/conversations/CreateConversation';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RecipientLayout(): JSX.Element {
  return (
    <Fragment>
      <Stack.Screen options={{ headerShown: false }} />

      <Stack>
        <Stack.Screen name="index" />

        <Stack.Screen
          name="recipients"
          options={{
            headerTitle: 'Choose Recipients',
            headerRight: () => <CreateConversation />,
            presentation: 'modal',
            gestureEnabled: true,
          }}
        />
      </Stack>
    </Fragment>
  );
}
