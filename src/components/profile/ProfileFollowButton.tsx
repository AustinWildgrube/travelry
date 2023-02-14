import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { UserProfile, followUser, getUserProfile, isFollowingUser, unfollowUser } from '&/queries/users';

interface FollowButtonProps {
  loggedInUser: UserProfile;
  setViewedUser: (user: UserProfile) => void;
  viewedUser: UserProfile;
}

export function ProfileFollowButton({ loggedInUser, setViewedUser, viewedUser }: FollowButtonProps): JSX.Element {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['following', loggedInUser.id, viewedUser.id],
    queryFn: () => isFollowingUser(loggedInUser.id, viewedUser.id),
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data === 0 ? followUser(loggedInUser.id, viewedUser.id) : unfollowUser(loggedInUser.id, viewedUser.id),
    onSuccess: async () => {
      // Maybe switch userProfile to use React Query?
      setViewedUser(await getUserProfile(viewedUser.id));
      queryClient.setQueryData(['following', loggedInUser.id, viewedUser.id], data === 0 ? 1 : 0);
    },
  });

  return (
    <>
      {loggedInUser.id !== viewedUser.id && (
        <TouchableOpacity onPress={() => mutate()}>
          <Text style={styles.followText}>{!!data ? 'Unfollow' : 'Follow'}</Text>
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
