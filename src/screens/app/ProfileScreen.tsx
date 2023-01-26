import { FC } from 'react';

import { ScrollView } from 'tamagui';

import { Header, Images } from 'src/components';

export const ProfileScreen: FC = (): JSX.Element => {
  return (
    <ScrollView pl="$4" pr="$4">
      <Header />
      <Images />
    </ScrollView>
  );
};
