import { Fragment } from 'react';
import { Dimensions, FlatList, View, type ListRenderItemInfo } from 'react-native';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';

import { Box } from '&/components/core';
import { FeedEnd, MemoizedPost } from '&/components/feed';
import { Header, LoadingIndicator } from '&/components/shared';
import { getFeedPosts } from '&/queries/post';
import { useUserStore } from '&/stores/user';
import { type PaginatedData, type Post } from '&/types/types';
import { POSTS_PER_PAGE } from '&/utils/constants';
import { makeStyles } from '&/utils/makeStyles';

export default function Feed(): JSX.Element {
  const styles = useStyles();
  const width = Math.round(Dimensions.get('window').width - 32);

  const user = useUserStore(state => state.user);
  if (!user) return <LoadingIndicator />;

  const {
    data: feedPosts,
    isLoading: isLoadingFeedPosts,
    hasNextPage: hasMoreFeedPosts,
    fetchNextPage: fetchNextPageOfPosts,
    refetch: refetchFeedPosts,
    isRefetching: isRefetchingFeedPosts,
  } = useInfiniteQuery({
    queryKey: ['feedPosts'],
    queryFn: ({ pageParam = 1 }) => getFeedPosts(pageParam, user.id),
    getNextPageParam: lastPage => {
      if (lastPage.count && lastPage.count <= lastPage.cursor * POSTS_PER_PAGE - 1) {
        return undefined;
      } else {
        return lastPage.cursor + 1;
      }
    },
  });

  const renderItem = (page: ListRenderItemInfo<PaginatedData<Post>>): JSX.Element => (
    <Fragment>
      {page.item.data.map((post: Post) => (
        <MemoizedPost post={post} key={post.id} />
      ))}
    </Fragment>
  );

  return (
    <View style={styles.feed}>
      <Stack.Screen options={{ headerTitle: () => <Header /> }} />

      {isLoadingFeedPosts &&
        [...Array(3)].map((_, index: number) => (
          <Box key={index} style={styles.placeholderContainer}>
            <Placeholder Animation={Fade}>
              <PlaceholderMedia size={width} />
            </Placeholder>

            <Box style={styles.placeholderDetails}>
              <Placeholder Animation={Fade} Left={PlaceholderMedia}>
                <PlaceholderLine width={80} />
                <PlaceholderLine width={30} />
              </Placeholder>
            </Box>
          </Box>
        ))}

      {!isLoadingFeedPosts && feedPosts && (
        <FlatList
          data={feedPosts.pages}
          renderItem={renderItem}
          refreshing={isRefetchingFeedPosts}
          onRefresh={refetchFeedPosts}
          onEndReached={() => fetchNextPageOfPosts()}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={hasMoreFeedPosts ? null : <FeedEnd />}
        />
      )}
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  feed: {
    backgroundColor: theme.colors['backgroundLight0'],
    flex: 1,
    paddingTop: theme.space['2'],
  },
  placeholderContainer: {
    justifyContent: 'center',
    marginHorizontal: theme.space['4'],
    marginTop: theme.space['4'],
  },
  placeholderDetails: {
    marginBottom: theme.space['6'],
    marginTop: theme.space['2'],
  },
}));
