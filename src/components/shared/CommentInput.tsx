import { Image, StyleSheet, Text, View } from 'react-native';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';

import { Input } from '&/components/atoms';
import { useCurrentUser } from '&/contexts/AuthProvider';
import { createComment } from '&/queries/comments';
import { downloadSupabaseMedia } from '&/utilities/helpers';

interface PostCommentsProps {
  postId: string;
}

export function CommentInput({ postId }: PostCommentsProps): JSX.Element {
  const user = useCurrentUser();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => createComment(user.id, postId, getValues('comment'), false),
    onSuccess: () => {
      reset({ comment: '' });
      queryClient.invalidateQueries(['comments', postId]);
    },
  });

  const {
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      comment: '',
    },
  });

  const submitComment = (): void => {
    if (getValues('comment') === '') {
      return;
    }

    mutate();
  };

  return (
    <View style={styles.container}>
      <View style={styles.commentContainer}>
        <Image
          source={{
            uri: downloadSupabaseMedia('avatars', user.avatar_url),
          }}
          style={styles.commenterAvatar}
        />

        <Controller
          name="comment"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Comment"
              placeholder="Wow! This is so cool!"
              onChangeText={onChange}
              returnKeyType="send"
              onSubmit={submitComment}
              value={value}
            />
          )}
        />

        {errors.comment && <Text>Comment Required</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  commentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  commenterAvatar: {
    borderRadius: 50,
    height: 54,
    marginRight: 8,
    width: 54,
  },
});
