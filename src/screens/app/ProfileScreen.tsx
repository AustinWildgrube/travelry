import { ScrollView } from 'tamagui';

import { Header, Images } from '&/components/profile';

export function ProfileScreen(): JSX.Element {
  return (
    <ScrollView pl="$4" pr="$4">
      <Header />
      <Images />
    </ScrollView>
  );
}
