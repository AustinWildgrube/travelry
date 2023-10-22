import { Fragment, useEffect, useRef, useState } from 'react';
import { Dimensions, Share, TouchableOpacity, View } from 'react-native';

import { useActionSheet } from '@expo/react-native-action-sheet';
import { Overlay } from '@gluestack-ui/overlay';
import BottomSheet from '@gorhom/bottom-sheet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeftIcon, MessageSquareIcon, MoreHorizontalIcon, ShareIcon } from 'lucide-react-native';
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';

import { Avatar, HStack, Heading, Icon, Image, Pressable, Text, Toast, useToast } from '&/components/core';
import { CommentList } from '&/components/post/CommentList';
import { LoadingIndicator, MemoizedLikeButton } from '&/components/shared';
import { useAvatarQuery } from '&/hooks/useAvatarQuery';
import { useDoubleTap } from '&/hooks/useDoubleTap';
import { likePost, unlikePost } from '&/queries/like';
import { deletePostById, getPostById } from '&/queries/post';
import { usePostStore } from '&/stores/post';
import { useUserStore } from '&/stores/user';
import { type InfiniteQuery, type PaginatedData, type Post } from '&/types/types';
import { getPublicImageUrl } from '&/utils/getPublicImageUrl';
import { getRelativeTime } from '&/utils/getRelativeTime';
import { makeStyles } from '&/utils/makeStyles';

export default function PostId(): JSX.Element {
  const styles = useStyles();
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const viewedPost = usePostStore(state => state.viewedPost);
  const user = useUserStore(state => state.user);
  const setViewedPost = usePostStore(state => state.setViewedPost);
  if (!user || !viewedPost) return <LoadingIndicator />;

  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { data: avatar } = useAvatarQuery(viewedPost.account.id, viewedPost.account.avatar_url);
  const { showActionSheetWithOptions } = useActionSheet();

  const [expandCaption, setExpandCaption] = useState(false);
  const [expandSwiper, setExpandSwiper] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [isPostLiked, setIsPostLiked] = useState(Object.keys(viewedPost.post_like).length > 0);

  const doubleTapBind = useDoubleTap(() => mutatePostLike(), {
    onSingleTap: () => setExpandSwiper(!expandSwiper),
  });

  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId, viewedPost.account.id),
    enabled: !!viewedPost,
  });

  const { data: postMedia, isLoading: isLoadingPostMedia } = useQuery({
    queryKey: ['postMedia', viewedPost.account.id],
    queryFn: () => Promise.all(viewedPost.post_media.map(item => getPublicImageUrl('posts', item.file_url))),
    enabled: !!viewedPost,
  });

  const { mutate: mutatePostLike } = useMutation({
    mutationFn: () => (isPostLiked ? unlikePost(viewedPost.account.id, viewedPost.id) : likePost(viewedPost.account.id, viewedPost.id)),
    onMutate: async () => impactAsync(ImpactFeedbackStyle.Medium),
    onSuccess: async () => {
      await queryClient.setQueryData(['feedPosts'], (oldData: InfiniteQuery<PaginatedData<Post>> | undefined): InfiniteQuery<PaginatedData<Post>> => {
        if (!oldData) return { pageParams: [], pages: [{ count: 0, cursor: 0, data: [] }] };

        for (const page of oldData.pages) {
          for (const oldPost of page.data) {
            if (oldPost.id === viewedPost.id) {
              oldPost.post_stat.likes_count = isPostLiked ? oldPost.post_stat.likes_count - 1 : oldPost.post_stat.likes_count + 1;
              break;
            }
          }
        }

        return oldData;
      });

      setViewedPost({
        ...viewedPost,
        post_stat: {
          ...viewedPost.post_stat,
          likes_count: isPostLiked ? viewedPost.post_stat.likes_count - 1 : viewedPost.post_stat.likes_count + 1,
        },
      });

      setIsPostLiked(!isPostLiked);
    },
  });

  const openPostActions = async (): Promise<void> => {
    const options = ['Edit Post', 'Cancel'];
    const isUserPost = viewedPost.account.id === user.id;
    const cancelButtonIndex = isUserPost ? 2 : 1;
    const destructiveButtonIndex = isUserPost ? 1 : undefined;

    if (isUserPost) options.splice(1, 0, 'Delete Post');

    showActionSheetWithOptions({ options, cancelButtonIndex, destructiveButtonIndex }, async (selectedIndex: number | undefined) => {
      switch (selectedIndex) {
        case 0:
          console.log('edit post'); // TODO: implement this
          break;

        case destructiveButtonIndex:
          await deletePostById(viewedPost.id);

          toast.show({
            placement: 'top',
            duration: 3000,
            render: () => (
              // @ts-ignore // TODO(gluestack-ui): fix this variant issue
              <Toast action="success">
                <Toast.Title>Post Successfully Deleted</Toast.Title>
              </Toast>
            ),
          });

          router.back();
          break;
      }
    });
  };

  // TODO: replace this with actual content
  const onShare = async (): Promise<void> => {
    await Share.share({
      message: `Check out an exciting post from ${viewedPost?.account.first_name} ${viewedPost?.account.last_name}!`,
      url: 'https://todo.com',
    });
  };

  useEffect(() => {
    if (!post) return;
    if (!viewedPost) setViewedPost(post);
  }, [viewedPost, post]);

  return (
    <Animated.View entering={SlideInRight.duration(500)} exiting={SlideOutLeft.duration(500)} style={styles.post}>
      <Fragment>
        {!isLoadingPost && (
          <SafeAreaView style={styles.postHeader}>
            <Pressable onPress={() => router.back()} accessibilityLabel="Go back" style={[styles.postHeaderInfoWrapper, styles.postHeaderBackButton]}>
              <Icon as={ChevronLeftIcon} size={28} color="#171717" />
            </Pressable>

            <HStack space="sm">
              <View style={[styles.postHeaderInfoWrapper, styles.postHeaderInfo]}>
                <Text size="sm">
                  {imageIndex + 1} / {viewedPost.post_media.length}
                </Text>
              </View>

              <View style={[styles.postHeaderInfoWrapper, styles.postHeaderInfo]}>
                <Text size="sm">{viewedPost.location}</Text>
              </View>

              {viewedPost.account.id === user.id && (
                <Pressable onPress={openPostActions} style={[styles.postHeaderInfoWrapper, styles.postHeaderInfo]}>
                  <Icon as={MoreHorizontalIcon} size={21} color="#2d323e" />
                </Pressable>
              )}
            </HStack>
          </SafeAreaView>
        )}

        {isLoadingPostMedia ? (
          <Placeholder Animation={Fade} style={styles.post}>
            <PlaceholderMedia size={9999} />
          </Placeholder>
        ) : (
          <SwiperFlatList
            data={postMedia}
            showPagination={false}
            onChangeIndex={({ index }) => setImageIndex(index)}
            renderItem={({ item, index }: { item: string; index: number }) => (
              <Pressable style={styles.post} {...doubleTapBind}>
                <Image
                  source={{ uri: item }}
                  placeholder={viewedPost?.post_media[index].file_placeholder}
                  accessibilityLabel="Post image"
                  style={styles.postImage}
                />
              </Pressable>
            )}
          />
        )}

        <SafeAreaView style={styles.postInfo}>
          {isLoadingPost ? (
            <Fragment>
              <Placeholder Animation={Fade} style={styles.postInfoWrapper}>
                <HStack>
                  <PlaceholderMedia size={92} style={styles.avatar} />

                  <View style={styles.postInfoActions}>
                    <PlaceholderMedia size={44} style={styles.avatar} />
                    <PlaceholderMedia size={44} style={styles.avatar} />
                    <PlaceholderMedia size={44} style={styles.avatar} />
                  </View>
                </HStack>
              </Placeholder>

              <PlaceholderLine width={80} />
              <PlaceholderLine />
              <PlaceholderLine width={30} />
            </Fragment>
          ) : (
            <Fragment>
              <HStack style={styles.postInfoWrapper}>
                <Link href={`/(tabs)/${viewedPost.account.id}`} asChild>
                  <Avatar as={TouchableOpacity} size="xl" style={styles.avatar}>
                    <Avatar.FallbackText>
                      {viewedPost.account.first_name} {viewedPost.account.last_name}
                    </Avatar.FallbackText>

                    <Avatar.Image source={{ uri: avatar }} placeholder={viewedPost?.account.avatar_placeholder} />
                  </Avatar>
                </Link>

                <HStack style={styles.postInfoActions}>
                  <Pressable onPress={onShare} style={styles.postInfoAction}>
                    <Icon as={ShareIcon} size={21} color="#2d323e" />
                  </Pressable>

                  <Pressable onPress={() => bottomSheetRef?.current?.expand()} style={styles.postInfoAction}>
                    <Icon as={MessageSquareIcon} size={21} color="#2d323e" />
                  </Pressable>

                  <View style={styles.postInfoAction}>
                    <MemoizedLikeButton isLiked={isPostLiked} likeAction={mutatePostLike} />
                  </View>
                </HStack>
              </HStack>

              <View style={styles.postInfoText}>
                <Link href={`/(tabs)/${viewedPost.account.id}`} asChild>
                  <Heading>
                    {viewedPost.account.first_name} {viewedPost.account.last_name}
                  </Heading>
                </Link>

                <Pressable onPress={() => setExpandCaption(!expandCaption)}>
                  <Text size="sm" numberOfLines={expandCaption ? undefined : 3}>
                    {viewedPost.caption}
                  </Text>
                </Pressable>

                <HStack space="xs">
                  <Text size="xs" style={styles.postInfoStat}>
                    Posted {getRelativeTime(viewedPost.created_at)}
                  </Text>

                  <Text size="xs" style={styles.postInfoStat}>
                    &#x2022; {viewedPost.post_stat.likes_count} likes
                  </Text>
                </HStack>
              </View>
            </Fragment>
          )}
        </SafeAreaView>
      </Fragment>

      <Overlay isOpen={expandSwiper} style={styles.overlay}>
        <SwiperFlatList
          showPagination
          data={postMedia}
          paginationStyle={styles.pagination}
          paginationStyleItem={styles.paginationDot}
          paginationStyleItemInactive={styles.paginationDotInactive}
          renderItem={({ item, index }: { item: string; index: number }) => (
            <Pressable onPress={() => setExpandSwiper(!expandSwiper)}>
              <Image
                source={{ uri: item }}
                placeholder={post?.post_media[index].file_placeholder}
                accessibilityLabel="Post image"
                contentFit="contain"
                style={styles.overlayImage}
              />
            </Pressable>
          )}
        />
      </Overlay>

      <CommentList bottomSheetRef={bottomSheetRef} postId={viewedPost.id} />
    </Animated.View>
  );
}

const width = Dimensions.get('window').width;
const useStyles = makeStyles(theme => ({
  post: {
    flex: 1,
  },
  postHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.space['2'],
    paddingHorizontal: theme.space['3'],
    position: 'absolute',
    width: theme.space['full'],
    zIndex: 1,
  },
  postHeaderInfoWrapper: {
    alignItems: 'center',
    backgroundColor: theme.colors['white'],
    borderRadius: theme.radii['lg'],
    justifyContent: 'center',
    opacity: theme.opacity['60'],
  },
  postHeaderBackButton: {
    height: theme.space['9'],
    width: theme.space['9'],
  },
  postHeaderBackButtonIcon: {
    color: theme.colors['black'],
    height: theme.space['5'],
    width: theme.space['5'],
  },
  postHeaderInfo: {
    flexDirection: 'row',
    height: theme.space['9'],
    padding: theme.space['2'],
  },
  postImage: {
    height: theme.space['full'],
    width: width,
  },
  postInfo: {
    backgroundColor: theme.colors['white'],
    paddingHorizontal: theme.space['3'],
  },
  postInfoWrapper: {
    justifyContent: 'space-around',
    marginBottom: theme.space['3'],
    marginTop: -theme.space['24'],
  },
  avatar: {
    borderRadius: theme.radii['full'],
    borderColor: theme.colors['white'],
    borderStyle: 'solid',
    borderWidth: theme.borderWidths['2'],
  },
  postInfoActions: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: theme.space['12'],
  },
  postInfoAction: {
    alignItems: 'center',
    backgroundColor: theme.colors['white'],
    borderRadius: theme.radii['full'],
    height: theme.space['11'],
    justifyContent: 'center',
    width: theme.space['11'],

    ...theme.shadow['1'],
  },
  postInfoText: {
    marginHorizontal: theme.space['2'],
  },
  postInfoStat: {
    color: theme.colors['light600'],
    marginTop: theme.space['4'],
  },
  pagination: {
    marginBottom: theme.space['6'],
  },
  paginationDot: {
    height: theme.space['1.5'],
    marginHorizontal: theme.space['1'],
    width: theme.space['4.5'],
  },
  paginationDotInactive: {
    height: theme.space['1.5'],
    width: theme.space['1.5'],
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, .9)',
    padding: theme.space['0'],
  },
  overlayImage: {
    height: theme.space['full'],
    width: Dimensions.get('screen').width,
  },
}));
