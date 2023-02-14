import { ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/core';

import { ProfileAlbums, ProfileHeader } from '&/components/profile';
import { type AppNavProps } from '&/navigators/root-navigator';
import { useAlbumStore } from '&/stores/album';
import { useUserStore } from '&/stores/user';

export function ProfileScreen(): JSX.Element {
  const navigation = useNavigation<AppNavProps<'Post'>>();
  const viewedUser = useUserStore(state => state.viewedUser);
  const setViewedAlbum = useAlbumStore(state => state.setViewedAlbum);

  return (
    <ScrollView>
      <ProfileHeader user={viewedUser} />
      <ProfileAlbums navigation={navigation} setViewedAlbum={setViewedAlbum} user={viewedUser} />
    </ScrollView>
  );
}
