import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getPublicImageUrl } from '&/utils/getPublicImageUrl';

export const useAvatarQuery = (userId: string | undefined, avatarUrl: string | null | undefined): UseQueryResult<string> => {
  return useQuery({
    queryKey: ['avatar', userId],
    queryFn: () => {
      if (!avatarUrl) return;
      return getPublicImageUrl('avatars', avatarUrl);
    },
    enabled: !!userId && !!avatarUrl,
  });
};
