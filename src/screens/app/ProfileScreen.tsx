import { ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/core';

import { ProfileAlbums, ProfileHeader } from '&/components/profile';
import { type AppNavProps } from '&/navigators/root-navigator';
import { useAlbumStore } from '&/stores/album';
import { useUserStore } from '&/stores/user';

export function ProfileScreen(): JSX.Element {
  return (
    <ScrollView>
      <ProfileHeader />
      <ProfileAlbums />
    </ScrollView>
  );
}
