import { useRef } from 'react';
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, View } from 'react-native';

import BottomSheet from '@gorhom/bottom-sheet';
import { useSearchParams } from 'expo-router';

import { PostComments, PostImages, PostInfo } from '&/components/post';
import { CommentInput } from '&/components/shared/CommentInput';
import { usePostStore } from '&/stores/post';

interface PostProps {
  startIndex: number;
}

export default function Post(): JSX.Element | void {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const viewedPost = usePostStore(state => state.viewedPost);
  const { startIndex = 0 }: Partial<PostProps> = useSearchParams();

  return (
    <>
      {viewedPost && (
        <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={75} style={styles.keyboard}>
          <PostImages postLocation={viewedPost.location} postMedia={viewedPost.post_media} startIndex={startIndex} />

          <View style={styles.postBottom}>
            <PostInfo
              accountId={viewedPost.account.id}
              accountAvatarUrl={viewedPost.account.avatar_url}
              accountFullName={viewedPost.account.full_name}
              postId={viewedPost.id}
              postCreatedAt={viewedPost.created_at}
              postCaption={viewedPost.caption}
              postLikeCount={viewedPost.post_stat.likes_count}
            />

            <Text style={styles.commentTitle}>Comments</Text>
            <CommentInput postId={viewedPost.id} />

            <Pressable onPress={() => bottomSheetRef?.current?.expand()} style={styles.showComments}>
              <Text>Show Comments</Text>
            </Pressable>
          </View>

          <PostComments bottomSheetRef={bottomSheetRef} postId={viewedPost.id} />
        </KeyboardAvoidingView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  postBottom: {
    backgroundColor: '#fff',
    flex: 0.35,
    paddingHorizontal: 16,
  },
  commentTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  showComments: {
    alignItems: 'center',
    marginTop: 16,
  },
});
