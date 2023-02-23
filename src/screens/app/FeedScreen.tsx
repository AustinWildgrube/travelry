import { ScrollView } from 'react-native';

import { useQuery } from '@tanstack/react-query';

import { Layout } from '&/components/atoms';
import { FeedPost } from '&/components/feed/FeedPost';
import { getAllPosts, type Post } from '&/queries/posts';

export function FeedScreen(): JSX.Element {
  const { data } = useQuery({
    queryKey: ['feedPosts'],
    queryFn: () => getAllPosts(),
  });

  return (
    <ScrollView>
      <Layout>
        {data?.map((post: Post) => (
          <FeedPost postId={post.id} key={post.id} />
        ))}
      </Layout>
    </ScrollView>
  );
}
