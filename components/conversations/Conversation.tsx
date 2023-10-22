import { TouchableOpacity, View } from 'react-native';

import { Link } from 'expo-router';

import { ConversationSwipe } from '&/components/conversations/ConversationSwipe';
import { Avatar, Heading, HStack, Pressable, Text, VStack } from '&/components/core';
import { LoadingIndicator } from '&/components/shared';
import { useAvatarQuery } from '&/hooks/useAvatarQuery';
import { useUserStore } from '&/stores/user';
import { type Conversation } from '&/types/types';
import { makeStyles } from '&/utils/makeStyles';

type ConversationProps = {
  conversation: Conversation;
};

export function Conversation({ conversation }: ConversationProps): JSX.Element {
  const styles = useStyles();

  const user = useUserStore(state => state.user);
  if (!user) return <LoadingIndicator />;

  const mostRecentMessage = conversation.details.messages[0];
  const { data: avatar } = useAvatarQuery(mostRecentMessage.account_id.id, mostRecentMessage.account_id.avatar_url);

  const formatMessageDate = (createdAt: string): string => {
    const createdAtDate = new Date(createdAt); // supabase returns a string
    const diffMs = new Date().getTime() - createdAtDate.getTime();
    const diffHrs = Math.round(diffMs / (1000 * 60 * 60));

    if (diffHrs < 24) {
      return createdAtDate.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
    } else {
      return createdAtDate.toLocaleDateString('en-us', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  const getTargetUsers = (): string => {
    const conversationTarget = conversation.details.conversation_target.filter(target => target.id !== user.id);
    return conversationTarget.map(target => `${target.first_name} ${target.last_name}`).join(', ');
  };

  return (
    <ConversationSwipe conversationId={conversation.details.id} userId={user.id}>
      <Link href={`/conversations/${conversation.details.id}`} style={styles.message} asChild>
        <Pressable>
          <Link href={`/(tabs)/${mostRecentMessage.account_id.id}`} asChild>
            <Avatar as={TouchableOpacity}>
              <Avatar.FallbackText>
                {mostRecentMessage.account_id.first_name} {mostRecentMessage.account_id.last_name}
              </Avatar.FallbackText>

              <Avatar.Image source={{ uri: avatar }} placeholder={mostRecentMessage.account_id.avatar_placeholder} />
            </Avatar>
          </Link>

          <VStack style={styles.messageInfo}>
            <HStack style={styles.messageRow}>
              <Heading numberOfLines={1} size="sm" style={styles.messageTargets}>
                {getTargetUsers()}
              </Heading>

              <Text>{formatMessageDate(mostRecentMessage.created_at)}</Text>
            </HStack>

            <HStack style={styles.messageRow}>
              <Text numberOfLines={1} style={styles.messageBody}>
                {mostRecentMessage.body}
              </Text>

              {new Date(conversation.last_read) < new Date(mostRecentMessage.created_at) && <View style={styles.messageDot} />}
            </HStack>
          </VStack>
        </Pressable>
      </Link>
    </ConversationSwipe>
  );
}

const useStyles = makeStyles(theme => ({
  message: {
    backgroundColor: theme.colors['white'],
    flexDirection: 'row',
    padding: theme.space['4'],
  },
  messageInfo: {
    flex: 1,
    marginLeft: theme.space['3'],
  },
  messageRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageTargets: {
    width: theme.space['4/6'],
  },
  messageBody: {
    width: theme.space['5/6'],
  },
  messageDot: {
    backgroundColor: theme.colors['primary500'],
    borderRadius: theme.radii['full'],
    height: theme.space['3'],
    width: theme.space['3'],
  },
}));
