import { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import { AnimatedView } from '@tamagui/animations-react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';

import { HeartbeatAnimation } from '&/animations/heartbeat';
import { useCurrentUser } from '&/contexts/AuthProvider';
import { getLikesByAccountId, likePost, unlikePost } from '&/queries/likes';

interface LikeButtonProps {
  likeCount?: string;
  postId: string;
}

export function LikeButton({ likeCount, postId }: LikeButtonProps): JSX.Element {
  const user = useCurrentUser();
  const queryClient = useQueryClient();

  const [animationValue] = useState(new Animated.Value(1));
  const animatedStyle = { transform: [{ scale: animationValue }] };

  const { data } = useQuery({
    queryKey: ['likes', user.id],
    queryFn: () => getLikesByAccountId(user.id),
  });

  const { mutate } = useMutation({
    mutationFn: () => (isLiked() ? unlikePost(user.id, postId) : likePost(user.id, postId)),
    onMutate: () => {
      HeartbeatAnimation(animationValue, 0.8, 1).start();
      impactAsync(ImpactFeedbackStyle.Medium);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['likes', user.id]);
      queryClient.invalidateQueries(['post', postId]);
    },
  });

  const isLiked = (): boolean => {
    return !!data?.find(likes => likes.post_id === postId);
  };

  return (
    <AnimatedView style={animatedStyle}>
      <Pressable onPress={() => mutate()} style={styles.likeButton}>
        {isLiked() ? (
          <FontAwesome style={styles.likeHeart} name="heart" size={21} color="#d90429" />
        ) : (
          <FontAwesome style={styles.likeHeart} name="heart-o" size={21} color="black" />
        )}

        {likeCount ? <Text style={styles.likeCount}>{likeCount}</Text> : null}
      </Pressable>
    </AnimatedView>
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
