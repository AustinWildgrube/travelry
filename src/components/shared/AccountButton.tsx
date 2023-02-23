import { ReactNode } from 'react';
import { Pressable, type ViewStyle } from 'react-native';

import { useNavigation } from '@react-navigation/core';

import { type AppNavProps } from '&/navigators/root-navigator';
import { getUserProfile } from '&/queries/users';
import { useUserStore } from '&/stores/user';

interface AccountButtonProps {
  accountId: string;
  children: ReactNode;
  style?: ViewStyle;
}

export function AccountButton({ accountId, children, style }: AccountButtonProps): JSX.Element {
  const setViewedUser = useUserStore(state => state.setViewedUser);
  const navigation = useNavigation<AppNavProps<'Tabs'>>();

  const goToAccount = async (accountId: string): Promise<void> => {
    setViewedUser(await getUserProfile(accountId));
    navigation.navigate('Tabs', {
      screen: 'ProfileTab',
      params: {
        screen: 'Profile',
      },
    });
  };

  return (
    <Pressable onPress={() => goToAccount(accountId)} style={style}>
      {children}
    </Pressable>
  );
}
