import { ScrollView, StyleSheet } from 'react-native';

import { useQuery } from '@tanstack/react-query';
import { Stack } from 'expo-router';

import { Layout } from '&/components/atoms';
import { FeedPost } from '&/components/feed';
import { Post, getAllPosts } from '&/queries/posts';

export default function Index(): JSX.Element {
  const { data } = useQuery({
    queryKey: ['feedPosts'],
    queryFn: () => getAllPosts(),
  });

  return (
    <>
      <ScrollView style={styles.container}>
        <Layout>
          {data?.map((post: Post) => (
            <FeedPost post={post} key={post.id} />
          ))}
        </Layout>
      </ScrollView>

      <Stack.Screen options={{ headerTitle: 'Feed' }} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});
