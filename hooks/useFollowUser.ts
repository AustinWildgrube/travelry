import { useMutation, type QueryClient, type UseMutationResult } from '@tanstack/react-query';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';

import { followUser, unfollowUser } from '&/queries/user';
import { type User, type UserFollows } from '&/types/types';

export const useFollowUser = (
  userId: string | undefined,
  targetId: string | undefined,
  isFollowing: boolean | { count: number }[] | undefined,
  queryClient: QueryClient,
): UseMutationResult<void, unknown, void, void> => {
  return useMutation({
    mutationFn: () => {
      if (userId && targetId) return isFollowing ? unfollowUser(userId, targetId) : followUser(userId, targetId);
      return Promise.reject('Missing userId or targetId');
    },
    onMutate: async () => impactAsync(ImpactFeedbackStyle.Medium),
    onSuccess: async () => {
      // mutate the viewed account follow lists
      await queryClient.setQueryData(['following', userId], (oldData: UserFollows[] | undefined) => {
        if (!oldData) return undefined;

        return oldData.map(userFollows => {
          if (userFollows.account.id === targetId) {
            return {
              ...userFollows,
              is_following: !userFollows.is_following,
            };
          }

          return userFollows;
        });
      });

      await queryClient.setQueryData(['followers', userId], (oldData: UserFollows[] | undefined) => {
        if (!oldData) return undefined;

        return oldData.map(userFollows => {
          if (userFollows.account.id === targetId) {
            return {
              ...userFollows,
              is_following: !userFollows.is_following,
            };
          }

          return userFollows;
        });
      });

      // mutate the viewed account
      queryClient.setQueryData(['account', targetId], (oldData: User | undefined): User | undefined => {
        if (!oldData) return undefined;

        return {
          ...oldData,
          is_following: !oldData.is_following,
          account_stat: {
            ...oldData.account_stat,
            followers_count: oldData.account_stat.followers_count + (oldData.is_following ? -1 : 1),
          },
        };
      });

      // mutate the logged-in user's account
      queryClient.setQueryData(['account', userId], (oldData: User | undefined): User | undefined => {
        if (!oldData) return undefined;

        return {
          ...oldData,
          account_stat: {
            ...oldData.account_stat,
            following_count: oldData.account_stat.following_count + (oldData.is_following ? -1 : 1),
          },
        };
      });
    },
  });
};
