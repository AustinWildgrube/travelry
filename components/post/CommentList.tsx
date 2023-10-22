import { Fragment, useCallback, useMemo, useState, type MutableRefObject } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, type ListRenderItemInfo } from 'react-native';

import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { type BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useKeyboard } from '@react-native-community/hooks';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowUpIcon } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { z } from 'zod';

import { Box, Button, Center, Divider, Heading, HStack, Input, Text } from '&/components/core';
import { MemoizedComment } from '&/components/post/Comment';
import { LoadingIndicator } from '&/components/shared/LoadingIndicator';
import { createComment, getCommentsByPostId } from '&/queries/comment';
import { useUserStore } from '&/stores/user';
import { type Comment, type InfiniteQuery, type PaginatedData } from '&/types/types';
import { COMMENTS_PER_PAGE } from '&/utils/constants';
import { makeStyles } from '&/utils/makeStyles';

type CommentProps = {
  bottomSheetRef: MutableRefObject<BottomSheet | null>;
  postId: string;
};

const CommentFormSchema = z.object({
  text: z.string().max(500, {
    message: 'Your comment cannot be longer than 500 characters',
  }),
});

type CommentForm = z.infer<typeof CommentFormSchema>;

export function CommentList({ bottomSheetRef, postId }: CommentProps): JSX.Element {
  const styles = useStyles();
  const keyboard = useKeyboard();
  const queryClient = useQueryClient();
  const snapPoints = useMemo(() => ['75%'], []);

  const [inReplyTo, setInReplyTo] = useState<{ id: number; name: string; origin: number } | null>(null);

  const { control, handleSubmit, reset } = useForm<CommentForm>({
    resolver: zodResolver(CommentFormSchema),
  });

  const user = useUserStore(state => state.user);
  if (!user) return <LoadingIndicator />;

  const {
    data: comments,
    isLoading: isLoadingComments,
    fetchNextPage: fetchNextPageOfComments,
  } = useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam = 1 }) => getCommentsByPostId(pageParam, user.id, postId),
    getNextPageParam: lastPage => {
      if (lastPage.count && lastPage.count <= lastPage.cursor * COMMENTS_PER_PAGE - 1) {
        return undefined;
      } else {
        return lastPage.cursor + 1;
      }
    },
  });

  const { mutate: mutateCommentText } = useMutation({
    mutationFn: ({ text }: CommentForm) => createComment(user.id, postId, text, !!inReplyTo, inReplyTo?.id, inReplyTo?.origin),
    onSuccess: (newComment: Comment) => {
      if (inReplyTo) {
        queryClient.setQueryData(['replies', inReplyTo.origin], (oldData: PaginatedData<Comment> | undefined): PaginatedData<Comment> => {
          if (!oldData) return { data: [newComment], count: 0, cursor: 0 };
          return { data: [...oldData.data, newComment], count: oldData.count, cursor: oldData.cursor };
        });

        queryClient.setQueryData(
          ['comments', postId],
          (oldData: InfiniteQuery<PaginatedData<Comment>> | undefined): InfiniteQuery<PaginatedData<Comment>> => {
            if (!oldData) return { pageParams: [], pages: [{ count: 0, cursor: 0, data: [] }] };

            for (const page of oldData.pages) {
              for (const oldComment of page.data) {
                if (oldComment.id === inReplyTo.origin) {
                  oldComment.comment_stat.replies_count += 1;
                  break;
                }
              }
            }

            return oldData;
          },
        );
      } else {
        queryClient.setQueryData(
          ['comments', postId],
          (oldData: InfiniteQuery<PaginatedData<Comment>> | undefined): InfiniteQuery<PaginatedData<Comment>> => {
            if (!oldData) return { pageParams: [], pages: [{ count: 0, cursor: 0, data: [] }] };

            const newCommentPage: PaginatedData<Comment> = {
              count: oldData.pages[0].count + 1,
              cursor: oldData.pages[0].cursor + 1,
              data: [newComment, ...oldData.pages[0].data],
            };

            return {
              pages: [newCommentPage, ...oldData.pages.slice(1)],
              pageParams: oldData.pageParams,
            };
          },
        );
      }

      if (setInReplyTo) setInReplyTo(null);
      reset();
    },
  });

  const submitComment = ({ text }: CommentForm): void => {
    if (text === '') return;
    mutateCommentText({ text });
  };

  const renderItem = (page: ListRenderItemInfo<PaginatedData<Comment>>): JSX.Element => {
    return (
      <Fragment>
        {page.item.data.map((comment: Comment) => (
          <MemoizedComment comment={comment} setInReplyTo={setInReplyTo} key={comment.id} />
        ))}
      </Fragment>
    );
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => <BottomSheetBackdrop disappearsOnIndex={-1} appearsOnIndex={0} {...props} />,
    [],
  );

  return (
    <BottomSheet
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      keyboardBehavior="extend"
      onClose={Keyboard.dismiss}
      index={-1}
      ref={bottomSheetRef}
      enablePanDownToClose>
      {isLoadingComments && (
        <Box style={styles.loadingWrapper}>
          {[...Array(10)].map((_, index: number) => (
            <Placeholder Animation={Fade} Left={PlaceholderMedia} key={index}>
              <PlaceholderLine width={80} />
              <PlaceholderLine />
              <PlaceholderLine width={30} />
            </Placeholder>
          ))}
        </Box>
      )}

      {!isLoadingComments && comments?.pages && comments?.pages[0].count > 0 && (
        <Box style={styles.commentList}>
          <BottomSheetFlatList
            data={comments.pages}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            onEndReached={() => fetchNextPageOfComments()}
            onEndReachedThreshold={0.5}
          />
        </Box>
      )}

      {!isLoadingComments && (!comments?.pages || comments?.pages[0].count === 0) && (
        <Center style={styles.commentList}>
          <Heading>Be the first to comment!</Heading>
        </Center>
      )}

      {!isLoadingComments && (
        <Fragment>
          <Divider style={inReplyTo ? styles.replyDivider : styles.commentDivider} />

          {inReplyTo && (
            <HStack style={styles.replyWrapper}>
              <Text numberOfLines={1}>Replying to: </Text>
              <Text style={styles.replyToUser}>{inReplyTo.name}</Text>

              <Button onPress={() => setInReplyTo(null)} variant="link" style={styles.replyCancelButton}>
                <Button.Text>Cancel</Button.Text>
              </Button>
            </HStack>
          )}

          <Box style={[styles.inputWrapper, keyboard.keyboardShown && styles.inputWrapperWithKeyboard]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : undefined}>
              <Controller
                name="text"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input size="lg" variant="rounded" style={styles.input}>
                    <Input.Input
                      as={BottomSheetTextInput}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      returnKeyType="send"
                      placeholder="Comment"
                    />

                    {value && (
                      <Button onPress={handleSubmit(submitComment)} style={styles.submitButton}>
                        <Button.Icon as={ArrowUpIcon} size={21} style={styles.submitButtonIcon} />
                      </Button>
                    )}
                  </Input>
                )}
              />
            </KeyboardAvoidingView>
          </Box>
        </Fragment>
      )}
    </BottomSheet>
  );
}

const useStyles = makeStyles(theme => ({
  loadingWrapper: {
    padding: theme.space['4'],
  },
  commentList: {
    paddingBottom: theme.space['0'],
    paddingHorizontal: theme.space['4'],
    paddingTop: theme.space['4'],
    flex: 1,
  },
  commentDivider: {
    marginBottom: theme.space['4'],
  },
  replyDivider: {
    marginBottom: theme.space['0'],
  },
  replyWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyToUser: {
    fontWeight: theme.fontWeights['semibold'],
    marginRight: theme.space['1'],
  },
  replyCancelButton: {
    paddingHorizontal: theme.space['0.5'],
  },
  inputWrapper: {
    marginBottom: theme.space['6'],
    marginHorizontal: theme.space['4'],
  },
  inputWrapperWithKeyboard: {
    marginBottom: theme.space['3'],
  },
  input: {
    alignItems: 'center',
    paddingRight: theme.space['2'],
  },
  submitButton: {
    borderColor: 'transparent',
    borderRadius: theme.radii['full'],
    height: theme.space['8'],
    paddingHorizontal: theme.space['4'],
    width: theme.space['8'],
  },
  submitButtonIcon: {
    color: theme.colors['white'],
  },
}));
