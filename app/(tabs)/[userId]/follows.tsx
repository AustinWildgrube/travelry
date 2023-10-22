import { Fragment, useState } from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';

import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TabBar, TabView, type Route } from 'react-native-tab-view';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';

import { Center, Heading } from '&/components/core';
import { MemoizedFollowsUser } from '&/components/profile/FollowsUser';
import { getUserFollowers, getUserFollowing } from '&/queries/user';
import { useFollowStore } from '&/stores/follow';
import { makeStyles } from '&/utils/makeStyles';

export default function Follows(): JSX.Element {
  const styles = useStyles();
  const width = Dimensions.get('window').width;
  const viewedList = useFollowStore(state => state.viewedList);

  // TODO: make username instead of userId?
  const { userId, firstName } = useLocalSearchParams<{ userId: string; firstName: string }>();

  const [index, setIndex] = useState<number>(viewedList);
  const [routes] = useState<{ key: 'followers' | 'following'; title: string }[]>([
    { key: 'following', title: 'Following' },
    { key: 'followers', title: 'Followers' },
  ]);

  const { data: followers, isLoading: isLoadingFollowers } = useQuery({
    queryKey: ['followers', userId],
    queryFn: () => getUserFollowers(userId),
    enabled: index === 0,
  });

  const { data: following, isLoading: isLoadingFollowing } = useQuery({
    queryKey: ['following', userId],
    queryFn: () => getUserFollowing(userId),
    enabled: index === 1,
  });

  const renderScene = ({ route }: { route: Route }): JSX.Element | null => {
    switch (route.key) {
      case 'followers':
        if (isLoadingFollowers)
          return (
            <View style={styles.tabViewSkeleton}>
              {[...Array(14)].map((_, index: number) => (
                <Placeholder Animation={Fade} Left={PlaceholderMedia} key={index} style={styles.userSkeleton}>
                  <PlaceholderLine width={80} />
                  <PlaceholderLine width={30} />
                </Placeholder>
              ))}
            </View>
          );

        if (followers?.length === 0)
          return (
            <Center style={styles.tabView}>
              <Heading>{firstName} has no followers!</Heading>
            </Center>
          );

        return (
          <FlatList
            data={followers}
            renderItem={({ item }) => <MemoizedFollowsUser user={item.account} isFollowing={item.is_following as boolean} />}
          />
        );
      case 'following':
        if (isLoadingFollowing)
          return (
            <View style={styles.tabViewSkeleton}>
              {[...Array(14)].map((_, index: number) => (
                <Placeholder Animation={Fade} Left={PlaceholderMedia} key={index} style={styles.userSkeleton}>
                  <PlaceholderLine width={80} />
                  <PlaceholderLine width={30} />
                </Placeholder>
              ))}
            </View>
          );

        if (following?.length === 0)
          return (
            <Center style={styles.tabView}>
              <Heading>{firstName} is not following anyone!</Heading>
            </Center>
          );

        return (
          <FlatList
            data={following}
            renderItem={({ item }) => <MemoizedFollowsUser user={item.account} isFollowing={item.is_following as boolean} />}
          />
        );
      default:
        return null;
    }
  };

  const renderTabBar = (props: any): JSX.Element => (
    <TabBar renderLabel={({ route }) => <Text>{route.title}</Text>} indicatorStyle={styles.tabIndicator} style={styles.tabBar} {...props} />
  );

  return (
    <Fragment>
      <Stack.Screen options={{ headerTitle: routes[index].title }} />
      <StatusBar style="light" />

      <TabView
        navigationState={{ index, routes }}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        renderScene={renderScene}
        style={styles.tabView}
        lazy
      />
    </Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  tabViewSkeleton: {
    backgroundColor: theme.colors['white'],
  },
  userSkeleton: {
    marginBottom: theme.space['2'],
    paddingTop: theme.space['4'],
    paddingHorizontal: theme.space['4'],
  },
  tabView: {
    backgroundColor: theme.colors['white'],
    flex: 1,
  },
  tabBar: {
    backgroundColor: theme.colors['white'],
  },
  tabIndicator: {
    backgroundColor: theme.colors['black'],
  },
}));
