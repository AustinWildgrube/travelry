import { ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/core';
import { useQuery } from '@tanstack/react-query';

import { Layout } from '&/components/atoms';
import { FeedPost } from '&/components/feed/FeedPost';
import { type AppNavProps } from '&/navigators/root-navigator';
import { getAllPosts, type Post } from '&/queries/posts';
import { useUserStore } from '&/stores/user';

export function FeedScreen(): JSX.Element {
  const setViewedUser = useUserStore(state => state.setViewedUser);
  const navigation = useNavigation<AppNavProps<'Post'>>();

  const { data } = useQuery({
    queryKey: ['feedPosts'],
    queryFn: () => getAllPosts(),
  });

  return (
    <ScrollView>
      <Layout>
        {data?.map((post: Post) => (
          <FeedPost navigation={navigation} post={post} setViewedUser={setViewedUser} key={post.id} />
        ))}
      </Layout>
    </ScrollView>
  );
}
