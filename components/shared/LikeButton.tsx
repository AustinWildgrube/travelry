import { memo, useState } from 'react';
import { Animated } from 'react-native';

import { Heart } from 'lucide-react-native';

import { HeartbeatAnimation } from '&/animations/heartbeat';
import { Icon, Pressable, Text } from '&/components/core';
import { makeStyles } from '&/utils/makeStyles';

type LikeButtonProps = {
  isLiked: boolean;
  likeAction: () => void;
  likeCount?: number;
  iconSize?: number;
};

function LikeButton({ isLiked, likeAction, likeCount, iconSize = 21 }: LikeButtonProps): JSX.Element {
  const styles = useStyles();
  const [animationValue] = useState<Animated.Value>(new Animated.Value(1));
  const animatedStyle = { transform: [{ scale: animationValue }] };

  const pressLikeButton = () => {
    HeartbeatAnimation(animationValue, 0.8, 1).start();
    likeAction();
  };

  return (
    <Pressable onPress={pressLikeButton} style={styles.likeButton}>
      {likeCount ? <Text style={styles.likeCount}>{likeCount}</Text> : null}

      <Animated.View style={animatedStyle}>
        {isLiked ? (
          <Icon as={Heart} fill="#e11d48" size={iconSize} testID="heart" style={styles.heartIcon} />
        ) : (
          <Icon as={Heart} size={iconSize} testID="heart-o" style={styles.heartIconOutline} />
        )}
      </Animated.View>
    </Pressable>
  );
}

const useStyles = makeStyles(theme => ({
  likeButton: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  likeCount: {
    marginRight: theme.space['2'],
  },
  heartIconOutline: {
    color: theme.colors['warmGray800'],
  },
  heartIcon: {
    color: theme.colors['rose600'],
  },
}));

export const MemoizedLikeButton = memo(LikeButton);
