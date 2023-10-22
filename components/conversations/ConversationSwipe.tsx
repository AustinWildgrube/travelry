import { useRef } from 'react';
import { Animated, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useClickOutside } from 'react-native-click-outside';
import { RectButton, Swipeable } from 'react-native-gesture-handler';

import { deleteConversationTargetByAccountId } from '&/queries/message';
import { type Conversation } from '&/types/types';
import { makeStyles } from '&/utils/makeStyles';

interface ConversationSwipeProps {
  conversationId: number;
  userId: string;
  children: React.ReactNode;
}

const rightActionWidth = 92;
const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcons);

export const ConversationSwipe = ({ conversationId, userId, children }: ConversationSwipeProps): JSX.Element => {
  const styles = useStyles();
  const queryClient = useQueryClient();
  const swipeableRowRef = useRef<Swipeable>(null);
  const clickOutsideRef = useClickOutside<View>(() => swipeableRowRef.current?.close());

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>): JSX.Element => {
    const scale = dragX.interpolate({
      inputRange: [0, rightActionWidth],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const deleteConversation = (): void => {
      swipeableRowRef.current?.close();
      // TODO: if target is last in conversation, delete conversation
      deleteConversationTargetByAccountId(userId, conversationId);

      queryClient.setQueryData(['conversations'], (oldData: any) => {
        return oldData.filter((conversation: Conversation) => conversation.details.id !== conversationId);
      });
    };

    return (
      <Animated.View style={styles.actionButton}>
        <RectButton onPress={deleteConversation} style={styles.rightAction}>
          <AnimatedIcon
            name="delete-forever"
            color="#fff"
            size={32}
            style={[
              styles.actionIcon,
              {
                transform: [{ translateX: scale }],
              },
            ]}
          />
        </RectButton>
      </Animated.View>
    );
  };

  return (
    <View ref={clickOutsideRef}>
      <Swipeable friction={2} rightThreshold={40} renderRightActions={renderRightActions} ref={swipeableRowRef}>
        {children}
      </Swipeable>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  actionButton: {
    transform: [{ translateX: 0 }],
    width: rightActionWidth,
  },
  actionIcon: {
    marginHorizontal: theme.space['2'],
  },
  rightAction: {
    alignItems: 'center',
    backgroundColor: theme.colors['error600'],
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
}));
