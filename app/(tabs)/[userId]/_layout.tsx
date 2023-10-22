import { TouchableOpacity } from 'react-native';

import { Link, Stack, useGlobalSearchParams } from 'expo-router';

import { Text } from '&/components/core';
import { useUserStore } from '&/stores/user';
import { makeStyles } from '&/utils/makeStyles';

export const unstable_settings = {
  initialRouteName: 'profile',
};

// TODO: theme this
export default function ProfileLayout(): JSX.Element {
  const styles = useStyle();
  const user = useUserStore(state => state.user);

  const { albumId } = useGlobalSearchParams<{ albumId: string }>();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Screen
          name="follows"
          options={{
            headerStyle: { backgroundColor: '#fff' },
            headerTitleStyle: { color: '#000' },
            gestureEnabled: true,
            presentation: 'modal',
            headerLeft: () => {
              return (
                <Link href="../" asChild>
                  <TouchableOpacity style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </Link>
              );
            },
          }}
        />
        <Stack.Screen
          name="albums/[albumId]"
          options={{
            headerTitle: user?.album.find(album => album.id === albumId)?.name || 'Album',
            headerStyle: { backgroundColor: '#fff' },
            headerTitleStyle: { color: '#000' },
            gestureEnabled: true,
            presentation: 'modal',
            headerLeft: () => {
              return (
                <Link href="../" asChild>
                  <TouchableOpacity style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </Link>
              );
            },
          }}
        />
      </Stack>
    </>
  );
}

const useStyle = makeStyles(theme => ({
  closeButton: {
    alignItems: 'center',
    color: theme.colors['primary500'],
    flexDirection: 'row',
  },
  closeButtonText: {
    color: theme.colors['primary500'],
  },
}));
