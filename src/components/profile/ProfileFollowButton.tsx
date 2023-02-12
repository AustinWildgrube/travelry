import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { UserProfile, followUser, isFollowingUser, unfollowUser } from '&/queries/users';

interface FollowButtonProps {
  loggedInUser: UserProfile;
  viewedUser: UserProfile;
}

export function ProfileFollowButton({ loggedInUser, viewedUser }: FollowButtonProps): JSX.Element {
  const [following, setFollowing] = useState<boolean>();

  const followAction = async (): Promise<void> => {
    if (following) {
      await unfollowUser(loggedInUser.id, viewedUser.id);
      setFollowing(false);
    } else {
      await followUser(loggedInUser.id, viewedUser.id);
      setFollowing(true);
    }
  };

  useEffect(() => {
    const isFollowing = async (): Promise<void> => {
      const isFollowing = await isFollowingUser(loggedInUser.id, viewedUser.id);
      setFollowing(!!isFollowing);
    };

    isFollowing();
  }, [loggedInUser, viewedUser]);

  return (
    <>
      {loggedInUser.id !== viewedUser.id && (
        <TouchableOpacity onPress={() => followAction()}>
          <Text style={styles.followText}>{following ? 'Unfollow' : 'Follow'}</Text>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  followText: {
    color: '#00a6fb',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
});
