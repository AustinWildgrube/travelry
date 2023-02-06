import { ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/core';

import { Layout } from '&/components/atoms';
import { FeedPost } from '&/components/feed/FeedPost';
import { AppNavProps } from '&/navigators/app-navigator';

export function FeedScreen(): JSX.Element {
  const navigation = useNavigation<AppNavProps<'Post'>>();

  return (
    <ScrollView>
      <Layout>
        <FeedPost navigation={navigation} />
      </Layout>
    </ScrollView>
  );
}
