import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProfileFollowButton } from '&/components/profile';
import { useCurrentUser } from '&/contexts/AuthProvider';
import { AlbumScreen } from '&/screens/app/AlbumScreen';
import { ProfileScreen } from '&/screens/app/ProfileScreen';
import { useAlbumStore } from '&/stores/album';
import { useUserStore } from '&/stores/user';

export type ProfileStackParamList = {
  Profile: undefined;
  Album: {
    albumId: string;
  };
};

export type ProfileNavProps<T extends keyof ProfileStackParamList> = NativeStackNavigationProp<
  ProfileStackParamList,
  T
>;

const Stack = createNativeStackNavigator<ProfileStackParamList>();
export function ProfileNavigator(): JSX.Element {
  const user = useCurrentUser();
  const viewedUser = useUserStore(state => state.viewedUser);
  const viewedAlbum = useAlbumStore(state => state.viewedAlbum);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Album" component={AlbumScreen} options={{ title: viewedAlbum.name }} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          headerRight: () => <ProfileFollowButton loggedInUser={user} viewedUser={viewedUser} />,
          title: `@${viewedUser.username}`,
        }}
      />
    </Stack.Navigator>
  );
}
