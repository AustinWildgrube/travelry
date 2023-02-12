import { ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/core';

import { ProfileHeader, ProfileImages } from '&/components/profile';
import { AppNavProps } from '&/navigators/app-navigator';
import { useUserStore } from '&/stores/user-store';

export function ProfileScreen(): JSX.Element {
  const navigation = useNavigation<AppNavProps<'Post'>>();
  const viewedUser = useUserStore(state => state.viewedUser);

  return (
    <ScrollView>
      <ProfileHeader user={viewedUser} />
      <ProfileImages user={viewedUser} navigation={navigation} />
    </ScrollView>
  );
}
