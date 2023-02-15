import { Pressable, StyleSheet, Text } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';

import { useCurrentUser } from '&/contexts/AuthProvider';
import { getLikesByAccountId } from '&/queries/likes';

interface LikeButtonProps {
  likeCount?: string;
  postId: string;
}

export function LikeButton({ likeCount, postId }: LikeButtonProps): JSX.Element {
  const user = useCurrentUser();

  const { data } = useQuery({
    queryKey: ['likes'],
    queryFn: () => getLikesByAccountId(user.id),
  });

  return (
    <Pressable style={styles.likeButton}>
      {!!data?.find(likes => likes.post_id === postId) ? (
        <FontAwesome style={styles.likeHeart} name="heart" size={21} color="#d90429" />
      ) : (
        <FontAwesome style={styles.likeHeart} name="heart-o" size={21} color="black" />
      )}

      {likeCount ? <Text style={styles.likeCount}>{likeCount}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  likeButton: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  likeHeart: {
    alignItems: 'center',
  },
  likeCount: {
    color: '#7C8089',
    marginLeft: 8,
  },
});
