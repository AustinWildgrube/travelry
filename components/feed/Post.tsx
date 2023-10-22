import { memo, useState } from 'react';
import { ImageBackground } from 'react-native';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';

import { Avatar, Heading, HStack, Pressable, Text, VStack } from '&/components/core';
import { LoadingIndicator } from '&/components/shared/LoadingIndicator';
import { useAvatarQuery } from '&/hooks/useAvatarQuery';
import { useDoubleTap } from '&/hooks/useDoubleTap';
import { likePost, unlikePost } from '&/queries/like';
import { usePostStore } from '&/stores/post';
import { useUserStore } from '&/stores/user';
import { type InfiniteQuery, type PaginatedData, type Post } from '&/types/types';
import { getPublicImageUrl } from '&/utils/getPublicImageUrl';
import { makeStyles } from '&/utils/makeStyles';

type PostProps = {
  post: Post;
};

function Post({ post }: PostProps): JSX.Element {
  const styles = useStyles();
  const router = useRouter();
  const queryClient = useQueryClient();
  const setViewedPost = usePostStore(state => state.setViewedPost);

  const [isPostLiked, setIsPostLiked] = useState(Object.keys(post.post_like).length > 0);

  const user = useUserStore(state => state.user);
  if (!user) return <LoadingIndicator />;

  const doubleTapBind = useDoubleTap(() => mutatePostLike(), {
    onSingleTap: () => {
      setViewedPost(post);
      router.push({ pathname: `/post/${post.id}` });
    },
  });

  const { data: avatar } = useAvatarQuery(post.account.id, post.account.avatar_url);

  const { data: postMedia } = useQuery({
    queryKey: ['postMedia', post.id],
    queryFn: () => getPublicImageUrl('posts', post.post_media[0].file_url),
  });

  const { mutate: mutatePostLike } = useMutation({
    mutationFn: () => (isPostLiked ? unlikePost(user.id, post.id) : likePost(user.id, post.id)),
    onMutate: () => impactAsync(ImpactFeedbackStyle.Medium),
    onSuccess: async () => {
      await queryClient.setQueryData(['feedPosts'], (oldData: InfiniteQuery<PaginatedData<Post>> | undefined): InfiniteQuery<PaginatedData<Post>> => {
        if (!oldData) return { pageParams: [], pages: [{ count: 0, cursor: 0, data: [] }] };

        for (const page of oldData.pages) {
          for (const oldPost of page.data) {
            if (oldPost.id === post.id) {
              oldPost.post_stat.likes_count = isPostLiked ? oldPost.post_stat.likes_count - 1 : oldPost.post_stat.likes_count + 1;
              break;
            }
          }
        }

        return oldData;
      });

      setIsPostLiked(!isPostLiked);
    },
  });

  return (
    <Pressable key={post.created_at} style={styles.post} {...doubleTapBind}>
      <ImageBackground source={{ uri: postMedia }} style={styles.postMedia}>
        <LinearGradient colors={['rgba(0, 0, 0, 0.8)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.postMediaGradient} />

        <Link href={`/(tabs)/${post.account.id}`} style={styles.postInfo} asChild>
          <HStack as={Pressable} space="sm" style={styles.postInfoWrapper}>
            <Avatar style={styles.postAvatar}>
              <Avatar.FallbackText>
                {post.account.first_name} {post.account.last_name}
              </Avatar.FallbackText>

              <Avatar.Image source={{ uri: avatar }} placeholder={post.account.avatar_placeholder} />
            </Avatar>

            <VStack>
              <Heading size="xs" style={styles.postInfoText}>
                {post.account.first_name} {post.account.last_name}
              </Heading>

              <Text size="xs" style={styles.postInfoText}>
                {post.location}
              </Text>
            </VStack>
          </HStack>
        </Link>
      </ImageBackground>
    </Pressable>
  );
}

const useStyles = makeStyles(theme => ({
  post: {
    margin: theme.space['0.5'],
    marginHorizontal: theme.space['1'],
  },
  postMedia: {
    alignItems: 'flex-start',
    borderRadius: theme.radii['md'],
    height: theme.space['96'],
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.space['2'],
    overflow: 'hidden',
  },
  postMediaGradient: {
    height: '25%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  postInfo: {
    padding: theme.space['2'],
  },
  postInfoWrapper: {
    alignItems: 'center',
    marginTop: theme.space['2'],
  },
  postAvatar: {
    height: theme.space['10'],
    width: theme.space['10'],
  },
  postInfoText: {
    color: theme.colors['white'],
  },
}));

export const MemoizedPost = memo(Post);
