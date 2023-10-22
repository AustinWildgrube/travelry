import { memo } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { Avatar, Button, HStack, Heading, Pressable, Text, VStack } from '&/components/core';
import { LoadingIndicator } from '&/components/shared';
import { useAvatarQuery } from '&/hooks/useAvatarQuery';
import { useFollowUser } from '&/hooks/useFollowUser';
import { useUserStore } from '&/stores/user';
import { type UserSummary } from '&/types/types';
import { makeStyles } from '&/utils/makeStyles';

type FollowsUserProps = {
  user: UserSummary;
  isFollowing: boolean;
};

export function FollowsUser({ user, isFollowing }: FollowsUserProps): JSX.Element {
  const styles = useStyles();
  const query = useQueryClient();
  const router = useRouter();

  const { user: loggedInUser } = useUserStore(state => state);
  if (!loggedInUser) return <LoadingIndicator />;

  const { data: avatar } = useAvatarQuery(user.id, user.avatar_url);
  const { mutate: followUser } = useFollowUser(loggedInUser.id, user.id, isFollowing, query);

  const closeModalAndNavigate = () => {
    router.back(); // the modal won't close if we don't route back first
    router.push(`/(tabs)/${user.id}`);
  };

  return (
    <Pressable onPress={closeModalAndNavigate}>
      <HStack space="sm" style={styles.user}>
        <Avatar>
          <Avatar.FallbackText>
            {user.first_name} {user.last_name}
          </Avatar.FallbackText>

          <Avatar.Image source={{ uri: avatar }} placeholder={user.avatar_placeholder} />
        </Avatar>

        <VStack style={styles.userInfo}>
          <Heading size="sm">
            {user.first_name} {user.last_name}
          </Heading>

          <Text>@{user.username}</Text>
        </VStack>

        {loggedInUser.id !== user.id && (
          <Button onPress={() => followUser()} size="sm" style={styles.followButton}>
            <Button.Text style={styles.followButtonTitle}>{isFollowing ? 'Unfollow' : 'Follow'}</Button.Text>
          </Button>
        )}
      </HStack>
    </Pressable>
  );
}

const useStyles = makeStyles(theme => ({
  user: {
    alignItems: 'center',
    marginBottom: theme.space['2'],
    paddingHorizontal: theme.space['4'],
    paddingTop: theme.space['4'],
    width: theme.space['full'],
  },
  userInfo: {
    flex: 1,
  },
  followButton: {
    backgroundColor: theme.colors['backgroundLight900'],
    borderColor: theme.colors['backgroundLight900'],
    borderRadius: theme.radii['full'],
    paddingHorizontal: theme.space['6'],
  },
  followButtonTitle: {
    color: theme.colors['white'],
  },
}));

export const MemoizedFollowsUser = memo(FollowsUser);
