import { MutableRefObject, useCallback, useMemo } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { type BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useQuery } from '@tanstack/react-query';

import { AccountButton } from '&/components/shared/AccountButton';
import { getCommentsByPostId } from '&/queries/comments';
import { downloadSupabaseMedia } from '&/utilities/helpers';

interface PostCommentProps {
  bottomSheetRef: MutableRefObject<BottomSheet | null>;
  postId: string;
}

export function PostComments({ bottomSheetRef, postId }: PostCommentProps): JSX.Element {
  const snapPoints = useMemo(() => ['75%'], []);

  const { data: comments } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getCommentsByPostId(postId),
  });

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  return (
    <BottomSheet
      index={-1}
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      enablePanDownToClose>
      <BottomSheetScrollView style={styles.contentContainer}>
        {comments &&
          comments.map((comment: any) => (
            <View style={styles.commentContainer} key={comment.id}>
              <AccountButton accountId={comment.account.id}>
                <Image
                  source={{
                    uri: downloadSupabaseMedia('avatars', comment.account.avatar_url),
                  }}
                  style={styles.commenterAvatar}
                />
              </AccountButton>

              <View>
                <AccountButton accountId={comment.account.id}>
                  <Text style={styles.commenterName}>{comment.account.full_name}</Text>
                </AccountButton>

                <View style={styles.commentText}>
                  <Text>{comment.text}</Text>
                </View>

                <View style={styles.actions}>
                  <Text style={styles.action}>Like</Text>
                  <Text style={styles.action}>Reply</Text>
                </View>
              </View>
            </View>
          ))}

        {comments && comments.length === 0 && (
          <View style={styles.noComments}>
            <Text style={styles.noCommentsText}>Be the first to comment!</Text>
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    marginBottom: 32,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commenterAvatar: {
    borderColor: 'lightgray',
    borderRadius: 50,
    borderWidth: 1,
    height: 42,
    marginRight: 8,
    width: 42,
  },
  commenterName: {
    fontWeight: '600',
  },
  commentText: {
    marginVertical: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  action: {
    color: '#7C8089',
    marginRight: 12,
  },
  noComments: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.75 - 64,
  },
  noCommentsText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
