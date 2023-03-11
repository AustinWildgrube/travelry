import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useCurrentUser } from '&/contexts/AuthProvider';
import { followUser, isFollowingUser, unfollowUser } from '&/queries/users';

interface ProfileFollowButtonProps {
  viewedUserId: string;
}

export function ProfileFollowButton({ viewedUserId }: ProfileFollowButtonProps): JSX.Element {
  const queryClient = useQueryClient();
  const loggedInUser = useCurrentUser();

  const { data: isFollowing } = useQuery({
    queryKey: ['following', loggedInUser.id, viewedUserId],
    queryFn: () => isFollowingUser(loggedInUser.id, viewedUserId),
  });

  const { mutate: mutateIsFollowing } = useMutation({
    mutationFn: () =>
      isFollowing === 0 ? followUser(loggedInUser.id, viewedUserId) : unfollowUser(loggedInUser.id, viewedUserId),
    onSuccess: async () => {
      await queryClient.setQueryData(['following', loggedInUser.id, viewedUserId], isFollowing === 0 ? 1 : 0);
      await queryClient.invalidateQueries(['account', viewedUserId]);
    },
  });

  return (
    <>
      {loggedInUser.id !== viewedUserId && (
        <TouchableOpacity onPress={() => mutateIsFollowing()}>
          <Text style={styles.followText}>{!!isFollowing ? 'Unfollow' : 'Follow'}</Text>
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
