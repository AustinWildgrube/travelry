import { ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/core';

import { Header, Images } from '&/components/profile';
import { AppNavProps } from '&/navigators/app-navigator';

export function ProfileScreen(): JSX.Element {
  const navigation = useNavigation<AppNavProps<'Post'>>();

  return (
    <ScrollView>
      <Header />
      <Images navigation={navigation} />
    </ScrollView>
  );
}
