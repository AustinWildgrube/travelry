import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, TouchableOpacity } from 'react-native';

import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Link, useGlobalSearchParams, useRouter } from 'expo-router';
import { ChevronRightIcon } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';

import { Avatar, Button, Heading, HStack, Icon, Text, VStack } from '&/components/core';
import { BannerImage } from '&/components/profile/BannerImage';
import { LoadingIndicator } from '&/components/shared/LoadingIndicator';
import { useAvatarQuery } from '&/hooks/useAvatarQuery';
import { useFollowUser } from '&/hooks/useFollowUser';
import { getUserAccount } from '&/queries/user';
import { FollowListType, useFollowStore } from '&/stores/follow';
import { useUserStore } from '&/stores/user';
import { type UserAlbum } from '&/types/types';
import { makeStyles } from '&/utils/makeStyles';

export default function Index(): JSX.Element {
  const styles = useStyles();
  const router = useRouter();
  const queryClient = useQueryClient();
  const snapPoints = useMemo(() => ['40%', '90%'], []);
  const bottomSheetRef = useRef<BottomSheet | null>(null);

  const [showUserBubble, setShowUserBubble] = useState<boolean>(false);
  const [expandCaption, setExpandCaption] = useState<boolean>(false);

  const setViewedList = useFollowStore(state => state.setViewedList);
  const user = useUserStore(state => state.user);
  if (!user) return <LoadingIndicator />;

  // TODO: make username instead of userId?
  const { userId } = useGlobalSearchParams<{ userId: string }>();

  const { data: account, isLoading: isLoadingAccount } = useQuery({
    queryKey: ['account', userId],
    queryFn: () => {
      if (!user || !user.id) return null;
      return getUserAccount(userId, user.id);
    },
    enabled: !!userId,
  });

  const { data: avatar } = useAvatarQuery(account?.id, account?.avatar_url);
  const { mutate: followUserMutate } = useFollowUser(user.id, account?.id, account?.is_following, queryClient);

  const goToFollowList = (type: FollowListType): void => {
    setViewedList(type);
    router.push({
      pathname: `/(tabs)/${account?.id}/follows`,
      params: { firstName: account?.first_name || 'User' },
    });
  };

  const removeAvatarBubble = (): void => {
    setShowUserBubble(false);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) setShowUserBubble(true);
  }, []);

  const renderItem = ({ item }: { item: UserAlbum }) => (
    <Link href={`/${account?.id}/albums/${item.id}`} style={styles.albumCard} key={item.id} asChild>
      <Pressable>
        <Image
          source={{
            uri: 'https://plus.unsplash.com/premium_photo-1676320125952-85ced2f39d7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2369&q=80',
          }}
          placeholder={item.cover_placeholder}
          style={styles.albumCoverImage}
        />

        <VStack>
          <Heading size="sm">{item.name}</Heading>
          <Text>{`${item.post_count} ${item.post_count === 1 ? 'Post' : 'Posts'}`}</Text>
        </VStack>

        <Icon as={ChevronRightIcon} size={24} color="gray" />
      </Pressable>
    </Link>
  );

  useEffect(() => {
    if (!isLoadingAccount && !account) {
      Alert.alert('User not found', 'The user you are looking for does not exist.');
      router.push('/(tabs)/feed');
    }
  }, [isLoadingAccount, account, router]);

  return (
    <Fragment>
      <BottomSheet
        index={0}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundComponent={BannerImage}
        style={styles.bottomSheet}
        handleIndicatorStyle={styles.bottomSheetHandle}
        enablePanDownToClose>
        {isLoadingAccount || !account ? (
          <Fragment>
            <Placeholder Animation={Fade} style={styles.profileHeader}>
              <PlaceholderMedia size={96} style={styles.avatar} />
            </Placeholder>

            <Placeholder Animation={Fade}>
              <PlaceholderLine width={80} />
              <PlaceholderLine width={30} />
            </Placeholder>

            <Placeholder Animation={Fade} style={styles.bio}>
              <PlaceholderLine />
              <PlaceholderLine />
              <PlaceholderLine />
              <PlaceholderLine />
            </Placeholder>
          </Fragment>
        ) : (
          <Fragment>
            <HStack style={styles.profileHeader}>
              <Avatar size="xl" style={styles.avatar}>
                <Avatar.FallbackText>
                  {account.first_name} {account.last_name}
                </Avatar.FallbackText>

                <Avatar.Image source={{ uri: avatar }} placeholder={account.avatar_placeholder} />
              </Avatar>

              {!isLoadingAccount && account.id !== user.id && (
                <Button onPress={() => followUserMutate()} size="sm" style={styles.followButton}>
                  <Button.Text style={styles.followButtonTitle}>{account.is_following ? 'Unfollow' : 'Follow'}</Button.Text>
                </Button>
              )}
            </HStack>

            <Heading>
              {account.first_name} {account.last_name}
            </Heading>

            <HStack space="md">
              <Heading onPress={() => bottomSheetRef.current?.expand()} size="xs">
                {account.account_stat.trip_count} <Text size="sm">Albums</Text>
              </Heading>

              {account.id === user.id && (
                <Pressable onPress={() => goToFollowList(FollowListType.Following)}>
                  <Heading size="xs">
                    {account.account_stat.following_count} <Text size="sm">Following</Text>
                  </Heading>
                </Pressable>
              )}

              <Pressable onPress={() => goToFollowList(FollowListType.Followers)}>
                <Heading size="xs">
                  {account.account_stat.followers_count} <Text size="sm">Followers</Text>
                </Heading>
              </Pressable>
            </HStack>

            <Text onPress={() => setExpandCaption(!expandCaption)} numberOfLines={expandCaption ? undefined : 3} style={styles.bio}>
              {account.bio}
            </Text>

            <VStack space="sm" style={styles.albumsContainer}>
              <Heading size="sm">Albums</Heading>

              <BottomSheetFlatList
                data={account.album}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text>{account.first_name} has not created an album yet.</Text>}
              />
            </VStack>
          </Fragment>
        )}
      </BottomSheet>

      {showUserBubble && account && (
        <Animated.View entering={FadeIn.duration(250)} style={styles.avatarBubble}>
          <TouchableOpacity onPress={removeAvatarBubble}>
            <Avatar size="lg">
              <Avatar.FallbackText>
                {account.first_name} {account.last_name}
              </Avatar.FallbackText>

              <Avatar.Image source={{ uri: avatar }} placeholder={account.avatar_placeholder} />
            </Avatar>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  bottomSheet: {
    backgroundColor: theme.colors['backgroundLight0'],
    padding: theme.space['3'],

    ...theme.shadow['4'],
  },
  bottomSheetHandle: {
    backgroundColor: theme.colors['backgroundLight0'],
  },
  profileHeader: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.space['2'],
    marginTop: theme.space['6'],
  },
  avatar: {
    backgroundColor: theme.colors['black'],
    borderColor: theme.colors['backgroundLight0'],
    borderRadius: theme.radii['full'],
    borderWidth: theme.borderWidths['2'],
  },
  avatarBubble: {
    bottom: theme.space['2'],
    position: 'absolute',
    right: theme.space['2'],
    zIndex: -1,
  },
  followButton: {
    backgroundColor: theme.colors['backgroundLight0'],
    borderColor: theme.colors['backgroundLight0'],
    borderRadius: theme.radii['full'],
    paddingHorizontal: theme.space['6'],
  },
  followButtonTitle: {
    color: theme.colors['black'],
  },
  bio: {
    marginVertical: theme.space['3'],
  },
  albumsContainer: {
    flex: 1,
    marginBottom: theme.space['4'],
  },
  albumCard: {
    alignItems: 'center',
    backgroundColor: theme.colors['white'],
    borderColor: theme.colors['borderLight200'],
    borderRadius: theme.radii['sm'],
    borderWidth: theme.borderWidths['1'],
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.space['2'],
    paddingRight: theme.space['6'],
  },
  albumCoverImage: {
    borderBottomLeftRadius: theme.radii['xs'],
    borderTopLeftRadius: theme.radii['xs'],
    height: theme.space['24'],
    margin: -theme.space['px'],
    width: theme.space['24'],
  },
}));
