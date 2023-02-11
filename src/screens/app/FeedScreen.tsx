import { ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/core';

import { Layout } from '&/components/atoms';
import { FeedPost } from '&/components/feed/FeedPost';
import { AppNavProps } from '&/navigators/app-navigator';
import { useUserStore } from '&/stores/user-store';

export function FeedScreen(): JSX.Element {
  const setViewedUser = useUserStore(state => state.setViewedUser);
  const navigation = useNavigation<AppNavProps<'Post'>>();

  return (
    <ScrollView>
      <Layout>
        <FeedPost navigation={navigation} setViewedUser={setViewedUser} />
      </Layout>
    </ScrollView>
  );
}
