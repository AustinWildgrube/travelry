import { useRef } from 'react';
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, View } from 'react-native';

import BottomSheet from '@gorhom/bottom-sheet';
import { RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { PostImages, PostInfo } from '&/components/post';
import { PostComments } from '&/components/post/PostComments';
import { CommentInput } from '&/components/shared/CommentInput';
import { type AppStackParamList } from '&/navigators/root-navigator';
import { getPostById } from '&/queries/posts';
import { getUserProfile } from '&/queries/users';

interface PostScreenProps {
  route: RouteProp<AppStackParamList, 'Post'>;
}

export function PostScreen({ route }: PostScreenProps): JSX.Element {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { accountId, postId, startIndex } = route.params;

  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  });

  const { data: account, isLoading: isLoadingAccount } = useQuery({
    queryKey: ['account', accountId],
    queryFn: () => getUserProfile(accountId),
  });

  return (
    <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={75} style={styles.keyboard}>
      {!isLoadingPost && !isLoadingAccount && post && account && (
        <>
          <PostImages post={post} startIndex={startIndex} />

          <View style={styles.postBottom}>
            <PostInfo account={account} post={post} />

            <Text style={styles.commentTitle}>Comments</Text>
            <CommentInput postId={post.id} />

            <Pressable onPress={() => bottomSheetRef?.current?.expand()} style={styles.showComments}>
              <Text>Show Comments</Text>
            </Pressable>
          </View>

          <PostComments bottomSheetRef={bottomSheetRef} postId={post.id} />
        </>
      )}
    </KeyboardAvoidingView>
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
