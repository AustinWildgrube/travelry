import { FlatList, StyleSheet, View, type ListRenderItemInfo } from 'react-native';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Stack } from 'expo-router';

import { FeedEnd, FeedPost } from '&/components/feed';
import { LoadingIndicator } from '&/components/shared';
import { getAllPosts, type Post, type PostPaginated } from '&/queries/posts';
import { POSTS_PER_PAGE } from '&/utilities/constants';

export default function Index(): JSX.Element {
  const {
    data: feedPosts,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['feedPosts'],
    queryFn: ({ pageParam = 1 }) => getAllPosts(pageParam),
    getNextPageParam: (lastPage: PostPaginated) => {
      if (lastPage.count <= lastPage.cursor * POSTS_PER_PAGE - 1) {
        return undefined;
      } else {
        return lastPage.cursor + 1;
      }
    },
  });

  return (
    <>
      <View style={styles.container}>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <FlatList
            data={feedPosts?.pages}
            onEndReachedThreshold={0.5}
            onEndReached={() => fetchNextPage()}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item: PostPaginated) => item.cursor.toString()}
            ListFooterComponent={hasNextPage ? null : <FeedEnd />}
            renderItem={(page: ListRenderItemInfo<PostPaginated>) => (
              <View>
                {page.item.data.map((post: Post) => (
                  <FeedPost post={post} key={post.id} />
                ))}
              </View>
            )}
          />
        )}
      </View>

      <Stack.Screen options={{ headerTitle: 'Feed' }} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
});
