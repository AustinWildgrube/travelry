import { ScrollView } from 'react-native';

import { Header, Images } from '&/components/profile';

export function ProfileScreen(): JSX.Element {
  return (
    <ScrollView>
      <Header />
      <Images />
    </ScrollView>
  );
}
