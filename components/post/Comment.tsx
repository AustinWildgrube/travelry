import { Fragment, memo, useState, type Dispatch } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { useActionSheet } from '@expo/react-native-action-sheet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { setStringAsync } from 'expo-clipboard';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { Link } from 'expo-router';
import { ChevronRightIcon } from 'lucide-react-native';

import { Avatar, Button, Heading, HStack, Icon, Pressable, Text, VStack } from '&/components/core';
import { LoadingIndicator, MemoizedLikeButton } from '&/components/shared';
import { useAvatarQuery } from '&/hooks/useAvatarQuery';
import { useDoubleTap } from '&/hooks/useDoubleTap';
import { deleteCommentById, getRepliesByCommentId } from '&/queries/comment';
import { likeComment, unlikeComment } from '&/queries/like';
import { useUserStore } from '&/stores/user';
import { type Comment, type InfiniteQuery, type PaginatedData } from '&/types/types';
import { makeStyles } from '&/utils/makeStyles';

type CommentProps = {
  comment: Comment;
  setInReplyTo: Dispatch<{ id: number; name: string; origin: number } | null>;
};

function Comment({ comment, setInReplyTo }: CommentProps): JSX.Element {
  const styles = useStyles();
  const queryClient = useQueryClient();
  const doubleTapBind = useDoubleTap(() => mutateCommentLike());

  const { showActionSheetWithOptions } = useActionSheet();
  const { data: avatar } = useAvatarQuery(comment.account.id, comment.account.avatar_url);

  const [repliesPage, setRepliesPage] = useState(1);
  const [isCommentLiked, setIsCommentLiked] = useState(Object.keys(comment.comment_like).length > 0);

  const user = useUserStore(state => state.user);
  if (!user) return <LoadingIndicator />;

  const {
    data: replyData,
    refetch: refetchReply,
    isRefetching: isRefetchingReply,
  } = useQuery({
    queryKey: ['replies', comment.id],
    queryFn: () => {
      setRepliesPage(repliesPage + 1);
      return getRepliesByCommentId(repliesPage, user.id, comment.id);
    },
    enabled: false, // only fetch when the "View x Replies" button is pressed
  });

  const { mutate: mutateCommentLike } = useMutation({
    mutationFn: () => (isCommentLiked ? unlikeComment(user.id, comment.id) : likeComment(user.id, comment.id)),
    onMutate: () => impactAsync(ImpactFeedbackStyle.Medium),
    onSuccess: () => {
      if (comment.reply_origin_comment_id) {
        queryClient.setQueryData(
          ['replies', comment.reply_origin_comment_id],
          (oldData: PaginatedData<Comment> | undefined): PaginatedData<Comment> => {
            if (!oldData) return { data: [], count: 0, cursor: 0 };

            for (const oldReply of oldData.data) {
              if (oldReply.id === comment.id) {
                oldReply.comment_stat.likes_count = isCommentLiked ? oldReply.comment_stat.likes_count - 1 : oldReply.comment_stat.likes_count + 1;
                break;
              }
            }

            return oldData;
          },
        );
      } else {
        queryClient.setQueryData(
          ['comments', comment.post_id],
          (oldData: InfiniteQuery<PaginatedData<Comment>> | undefined): InfiniteQuery<PaginatedData<Comment>> => {
            if (!oldData) return { pageParams: [], pages: [{ count: 0, cursor: 0, data: [] }] };

            for (const page of oldData.pages) {
              for (const oldComment of page.data) {
                if (oldComment.id === comment.id) {
                  oldComment.comment_stat.likes_count = isCommentLiked
                    ? oldComment.comment_stat.likes_count - 1
                    : oldComment.comment_stat.likes_count + 1;
                  break;
                }
              }
            }

            return oldData;
          },
        );
      }

      setIsCommentLiked(!isCommentLiked);
    },
  });

  const hideReplies = (): void => {
    // removeQuery wasn't clearing added comments, so we must manually do it
    queryClient.setQueryData(['replies', comment.id], []);
    setRepliesPage(1);
  };

  const setReply = (comment: Comment): void => {
    setInReplyTo({
      id: comment.id,
      name: comment.account.first_name + ' ' + comment.account.last_name,
      origin: comment.reply_origin_comment_id ? comment.reply_origin_comment_id : comment.id,
    });
  };

  const openCommentActions = (): void => {
    const options = ['Copy Comment', 'Cancel'];
    const isDeletable = comment.account.id === user?.id;
    const cancelButtonIndex = isDeletable ? 2 : 1;
    const destructiveButtonIndex = isDeletable ? 1 : undefined;

    if (isDeletable) {
      options.splice(1, 0, 'Delete Comment');
    }

    showActionSheetWithOptions({ options, cancelButtonIndex, destructiveButtonIndex }, (selectedIndex: number | undefined) => {
      switch (selectedIndex) {
        case 0:
          setStringAsync(comment.text);
          break;

        case destructiveButtonIndex:
          deleteCommentById(comment.id);
          queryClient.setQueryData(['comments', comment.post_id], (oldData: Comment[] | undefined): Comment[] | undefined => {
            return oldData?.filter(oldComment => oldComment.id !== comment.id);
          });
          break;
      }
    });
  };

  return (
    <Fragment>
      <Pressable onLongPress={openCommentActions} key={comment.id} style={styles.comment} {...doubleTapBind}>
        <Link href={`/(tabs)/${comment.account.id}`} asChild>
          <Avatar as={TouchableOpacity} style={styles.commentAvatar}>
            <Avatar.FallbackText>
              {comment.account.first_name} {comment.account.last_name}
            </Avatar.FallbackText>

            <Avatar.Image source={{ uri: avatar }} placeholder={comment.account.avatar_placeholder} />
          </Avatar>
        </Link>

        <VStack style={styles.commentContainer}>
          <HStack space="xs" style={styles.commentParticipants}>
            <Link href={`/(tabs)/${comment.account.id}`}>
              <Heading size="sm">
                {comment.account.first_name} {comment.account.last_name}
              </Heading>
            </Link>

            {comment.in_reply_to_comment_id && comment.in_reply_to_comment_id.id !== comment.reply_origin_comment_id && (
              <Fragment>
                <Icon as={ChevronRightIcon} size={16} style={styles.commentReplyIcon} />

                <Link href={`/(tabs)/${comment.in_reply_to_comment_id.account.id}`}>
                  <Heading size="sm">
                    {comment.in_reply_to_comment_id.account.first_name} {comment.in_reply_to_comment_id.account.last_name}
                  </Heading>
                </Link>
              </Fragment>
            )}
          </HStack>

          <Text size="sm">{comment.text}</Text>

          <HStack style={styles.commentActions}>
            <Button onPress={() => setReply(comment)} size="sm" variant="link" style={styles.actionButton}>
              <Button.Text style={styles.actionButtonText}>Reply</Button.Text>
            </Button>

            {comment.comment_stat.replies_count > 0 && !comment.reply_origin_comment_id && (
              <Button onPress={() => refetchReply()} size="sm" variant="link" style={styles.actionButton}>
                <Button.Text style={styles.actionButtonText}>
                  {`View ${comment.comment_stat.replies_count} ${comment.comment_stat.replies_count === 1 ? 'Reply' : 'Replies'}`}
                </Button.Text>
              </Button>
            )}
          </HStack>
        </VStack>

        <MemoizedLikeButton isLiked={isCommentLiked} likeCount={comment.comment_stat.likes_count} likeAction={mutateCommentLike} iconSize={18} />
      </Pressable>

      {/* reply list: maybe move to a separate component? */}
      {isRefetchingReply ? (
        <View style={styles.loadingWrapper}>
          <LoadingIndicator size="small" />
        </View>
      ) : (
        replyData?.data?.map((reply: Comment, index: number) => (
          <View key={reply.id} style={styles.replyList}>
            <MemoizedComment comment={reply} setInReplyTo={setInReplyTo} />

            {index === replyData.data.length - 1 && (
              <HStack style={styles.replyActions}>
                {replyData.count > replyData.data.length && (
                  <Button onPress={() => refetchReply()} size="sm" variant="link" style={styles.actionButton}>
                    <Button.Text style={styles.actionButtonText}>
                      {`View ${replyData.count - replyData?.data.length} More ${
                        replyData.count - replyData?.data.length === 1 ? 'Reply' : 'Replies'
                      }`}
                    </Button.Text>
                  </Button>
                )}

                <Button onPress={hideReplies} size="sm" variant="link" style={styles.replyHideButton}>
                  <Button.Text style={styles.actionButtonText}>Hide Replies</Button.Text>
                </Button>
              </HStack>
            )}
          </View>
        ))
      )}
    </Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  comment: {
    flexDirection: 'row',
    marginBottom: theme.space['6'],
  },
  commentAvatar: {
    marginRight: theme.space['3'],
  },
  commentContainer: {
    flex: 1,
  },
  commentParticipants: {
    alignItems: 'center',
  },
  commentReplyIcon: {
    color: theme.colors['textLight900'],
  },
  commentActions: {
    alignItems: 'center',
  },
  actionButton: {
    marginRight: theme.space['2'],
    paddingHorizontal: theme.space['0'],
  },
  actionButtonText: {
    color: theme.colors['trueGray500'],
    fontWeight: theme.fontWeights['semibold'],
  },
  loadingWrapper: {
    marginBottom: theme.space['8'],
  },
  replyList: {
    paddingLeft: theme.space['8'],
  },
  replyActions: {
    marginBottom: theme.space['6'],
  },
  replyHideButton: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: theme.space['0'],
  },
}));

export const MemoizedComment = memo(Comment);
