import { Fragment } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { useActionSheet } from '@expo/react-native-action-sheet';
import { useQueryClient } from '@tanstack/react-query';
import { setStringAsync } from 'expo-clipboard';
import { useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Avatar, HStack, Text } from '&/components/core';
import { LoadingIndicator } from '&/components/shared';
import { useAvatarQuery } from '&/hooks/useAvatarQuery';
import { deleteMessageById } from '&/queries/message';
import { useUserStore } from '&/stores/user';
import { type Conversation, type ConversationMessage } from '&/types/types';
import { makeStyles } from '&/utils/makeStyles';

type MessageBubbleProps = {
  message: ConversationMessage;
  showTimestamp: boolean;
  rerenderMessages: boolean;
  setRerenderMessages: (value: boolean) => void;
};

export function MessageBubble({ message, showTimestamp, rerenderMessages, setRerenderMessages }: MessageBubbleProps): JSX.Element {
  const styles = useStyles();
  const queryClient = useQueryClient();

  const { showActionSheetWithOptions } = useActionSheet();
  const { data: avatar } = useAvatarQuery(message.account_id.id, message.account_id.avatar_url);
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();

  const user = useUserStore(state => state.user);
  if (!user) return <LoadingIndicator />;

  const isUserMessage = message.account_id.id === user.id;
  const formattedMessageTime = new Date(message.created_at).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });

  const openMessageActions = (): void => {
    const options = ['Copy Message', 'Cancel'];
    const cancelButtonIndex = isUserMessage ? 2 : 1;
    const destructiveButtonIndex = isUserMessage ? 1 : undefined;

    if (isUserMessage) options.splice(1, 0, 'Delete Message');

    showActionSheetWithOptions({ options, cancelButtonIndex, destructiveButtonIndex }, (selectedIndex: number | undefined) => {
      switch (selectedIndex) {
        case 0:
          setStringAsync(message.body);
          break;

        case destructiveButtonIndex:
          deleteMessageById(message.id);

          queryClient.setQueryData(['conversation', conversationId], (oldData: Conversation[] | undefined): Conversation[] | undefined => {
            if (!oldData) return undefined;

            for (let i = 0; i < oldData.length; i++) {
              if (oldData[i].details.id === parseInt(conversationId)) {
                oldData[i].details.messages = oldData[i].details.messages.filter(oldMessage => oldMessage.id !== message.id);
                break;
              }
            }

            return oldData;
          });

          // TODO: find a better way to update the conversation when a message is deleted
          // this seems like a hacky workaround to force a rerender of the conversation
          setRerenderMessages(!rerenderMessages);
          break;
      }
    });
  };

  return (
    <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} style={isUserMessage ? styles.messageRight : styles.messageLeft}>
      <TouchableOpacity onLongPress={openMessageActions} style={styles.messageContainer}>
        <HStack space="sm" reversed={isUserMessage}>
          {!isUserMessage && (
            <Avatar size="sm">
              <Avatar.FallbackText>
                {message.account_id.first_name} {message.account_id.last_name}
              </Avatar.FallbackText>

              <Avatar.Image source={{ uri: avatar }} placeholder={message.account_id.avatar_placeholder} />
            </Avatar>
          )}

          <View style={[styles.messageBubble, isUserMessage ? styles.messageBubbleRight : styles.messageBubbleLeft]}>
            <Text style={isUserMessage ? styles.messageBubbleTextRight : styles.messageBubbleTextLeft}>{message.body}</Text>
          </View>
        </HStack>

        {showTimestamp && (
          <Text size="xs" style={[styles.messageInfo, isUserMessage ? styles.messageRight : styles.messageLeft]}>
            {isUserMessage ? (
              formattedMessageTime
            ) : (
              <Fragment>
                {message.account_id.first_name || message.account_id.username} &#x2022; {formattedMessageTime}
              </Fragment>
            )}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const useStyles = makeStyles(theme => ({
  messageContainer: {
    marginBottom: theme.space['1'],
    maxWidth: theme.space['3/4'],
  },
  messageBubble: {
    borderRadius: theme.radii['lg'],
    paddingHorizontal: theme.space['4'],
    paddingVertical: theme.space['2'],
  },
  messageInfo: {
    flex: 1,
    marginBottom: theme.space['2'],
  },
  messageLeft: {
    marginLeft: theme.space['0'],
    marginRight: 'auto',
  },
  messageBubbleLeft: {
    backgroundColor: theme.colors['backgroundLight200'],
    borderBottomLeftRadius: theme.radii['none'],
  },
  messageBubbleTextLeft: {
    color: theme.colors['black'],
  },
  messageRight: {
    marginLeft: 'auto',
    marginRight: theme.space['0'],
  },
  messageBubbleRight: {
    backgroundColor: theme.colors['primary500'],
    borderBottomRightRadius: theme.radii['none'],
  },
  messageBubbleTextRight: {
    color: theme.colors['white'],
  },
}));
