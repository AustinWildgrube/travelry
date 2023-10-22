import { Fragment, useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, View, type ListRenderItemInfo } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ArrowUpIcon } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { z } from 'zod';

import { MessageBubble } from '&/components/conversations/MessageBubble';
import { Button, Center, Heading, Input, Text } from '&/components/core';
import { LoadingIndicator } from '&/components/shared';
import {
  createConversation,
  createConversationMessage,
  createConversationTargets,
  getConversation,
  updateConversationLastRead,
} from '&/queries/message';
import { supabase } from '&/services/supabase';
import { useMessageStore } from '&/stores/message';
import { useUserStore } from '&/stores/user';
import { type Conversation, type ConversationMessage } from '&/types/types';
import { makeStyles } from '&/utils/makeStyles';

const MessageFormSchema = z.object({
  text: z.string().max(500, {
    message: 'Your message cannot be longer than 500 characters',
  }),
});

type MessageForm = z.infer<typeof MessageFormSchema>;

export default function ConversationId() {
  const styles = useStyles();
  const queryClient = useQueryClient();
  const listRef = useRef<any>();
  const chosenRecipients = useMessageStore(state => state.chosenRecipients);
  const localSearchParams = useLocalSearchParams<{ conversationId: string }>();

  const [conversationId, setConversationIdString] = useState(localSearchParams.conversationId);
  const [rerenderMessages, setRerenderMessages] = useState(false);

  const user = useUserStore(state => state.user);
  if (!user) return <LoadingIndicator />;

  const { data: conversation, isLoading: isLoadingConversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => getConversation(conversationId),
    enabled: conversationId !== 'new',
  });

  const { mutate: mutateConversation } = useMutation({
    mutationFn: ({ text }: MessageForm) => createConversation(chosenRecipients, user.id),
    onSuccess: (newConversationId, variables) => {
      // TODO
      // - mutate the conversations from before or refetch
      // - check if conversation exists before creating a new one
      setConversationIdString(newConversationId);
      createConversationTargets(newConversationId, user.id, chosenRecipients);

      // setConversationIdString is synchronous, so we can use the new conversationIdString here
      createConversationMessage(newConversationId, user.id, variables.text);
      reset();
    },
  });

  const { mutate: mutateConversationMessage } = useMutation({
    mutationFn: ({ text }: MessageForm) => createConversationMessage(conversationId, user.id, text),
    onSuccess: () => reset(),
  });

  const { mutate: mutateLastRead } = useMutation({
    mutationFn: () => updateConversationLastRead(conversationId, user.id),
  });

  const { control, handleSubmit, reset } = useForm<MessageForm>({
    resolver: zodResolver(MessageFormSchema),
  });

  const sendMessage = ({ text }: MessageForm): void => {
    if (text === '') return;

    if (conversationId === 'new') {
      mutateConversation({ text });
    } else {
      mutateConversationMessage({ text });
    }
  };

  const getTargetUsers = (): string => {
    if (conversationId === 'new') return 'New Message';
    if (!conversation || !conversation) return '';

    const conversationTarget = conversation[0].details.conversation_target.filter(target => target.id !== user.id);
    return conversationTarget.map(target => `${target.first_name} ${target.last_name}`).join(', ');
  };

  const updateLastRead = (): void => {
    mutateLastRead();
    queryClient.setQueryData(['conversations'], (oldData: Conversation[] | undefined): Conversation[] | undefined => {
      if (!oldData) return undefined;

      for (let i = 0; i < oldData.length; i++) {
        if (oldData[i].details.id === parseInt(conversationId)) {
          oldData[i].last_read = new Date().toISOString();
          break;
        }
      }

      return oldData;
    });
  };

  const renderItem = ({ item, index }: ListRenderItemInfo<ConversationMessage>): JSX.Element | null => {
    if (!conversation) return null;

    const previousMessage = conversation[0].details.messages[index - 1];
    const nextMessage = conversation[0].details.messages[index + 1];

    const messageCreatedAt = new Date(item.created_at);
    const formattedDate = messageCreatedAt.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

    const messageDate = messageCreatedAt.toLocaleDateString();
    const previousMessageDate = previousMessage ? new Date(previousMessage.created_at).toLocaleDateString() : null;
    const showDate = messageDate !== previousMessageDate;

    const messageTime = messageCreatedAt.toLocaleTimeString([], { hour12: true, hour: 'numeric', minute: 'numeric' });
    const nextMessageTime = nextMessage
      ? new Date(nextMessage.created_at).toLocaleTimeString([], { hour12: true, hour: 'numeric', minute: 'numeric' })
      : null;

    const showTimestamp = messageTime !== nextMessageTime || item.account_id.id !== nextMessage?.account_id.id;

    return (
      <Fragment>
        {showDate && (
          <Center>
            <Heading size="xs" style={styles.conversationDate}>
              {formattedDate}
            </Heading>
          </Center>
        )}

        <MessageBubble message={item} showTimestamp={showTimestamp} rerenderMessages={rerenderMessages} setRerenderMessages={setRerenderMessages} />
      </Fragment>
    );
  };

  useEffect(() => {
    // TODO: we need to initially mutate the request, and then we can start changing it every time the conversation changes updates
    if (conversationId !== 'new') updateLastRead();

    const conversationMessage = supabase
      .channel('conversation_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversation_message' }, () => {
        // TODO: we need to not invalidate the query
        queryClient.invalidateQueries(['conversation', conversationId]);
        updateLastRead();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(conversationMessage);
    };
  }, [conversationId]);

  useEffect(() => {
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, [conversation]);

  return (
    <View style={styles.messages}>
      <Stack.Screen options={{ headerTitle: getTargetUsers(), headerBackTitle: 'All Messages' }} />

      {/* work around because isLoading is true for enabled queries */}
      {/* https://github.com/TanStack/query/issues/3584 */}
      {isLoadingConversation && conversationId !== 'new' && (
        <Fragment>
          <Placeholder Animation={Fade} style={styles.messageSkeleton}>
            <PlaceholderLine width={32} style={styles.messageSkeletonCenter} />
          </Placeholder>

          {[...Array(14)].map((_, index: number) => (
            <Fragment key={index}>
              <Placeholder Animation={Fade} style={styles.messageSkeleton}>
                <PlaceholderLine width={80} style={styles.messageSkeletonRight} />
                <PlaceholderLine width={60} style={styles.messageSkeletonRight} />
                <PlaceholderLine width={20} style={styles.messageSkeletonRight} />
              </Placeholder>

              <Placeholder Animation={Fade} Left={PlaceholderMedia} style={styles.messageSkeleton}>
                <PlaceholderLine width={80} />
                <PlaceholderLine width={60} />
                <PlaceholderLine width={20} />
              </Placeholder>
            </Fragment>
          ))}
        </Fragment>
      )}

      {(!isLoadingConversation || conversationId === 'new') && !conversation && (
        <View style={styles.conversationsEmptyState}>
          <Heading>Start Exploring the World with Friends!</Heading>
          <Text style={styles.conversationsEmptyStateText}>Don't wait, be the first to break the ice and create lasting memories!</Text>
        </View>
      )}

      {!isLoadingConversation && conversation && (
        <FlatList
          data={conversation[0].details.messages}
          extraData={rerenderMessages}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          renderItem={renderItem}
          ref={listRef}
        />
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={108} style={styles.inputWrapper}>
        <Controller
          name="text"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input size="lg" style={styles.input}>
              <Input.Input
                onFocus={listRef.current?.scrollToEnd({ animated: true })}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                returnKeyType="send"
                placeholder="Message"
              />

              {value && (
                <Button onPress={handleSubmit(sendMessage)} style={styles.submitButton}>
                  <Button.Icon as={ArrowUpIcon} size={21} style={styles.submitButtonIcon} />
                </Button>
              )}
            </Input>
          )}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  conversationDate: {
    marginVertical: theme.space['4'],
  },
  conversationsEmptyState: {
    alignItems: 'center',
    backgroundColor: theme.colors['white'],
    flex: 1,
    justifyContent: 'center',
  },
  conversationsEmptyStateText: {
    textAlign: 'center',
    width: theme.space['5/6'],
  },
  messageSkeleton: {
    marginBottom: theme.space['3'],
  },
  messageSkeletonRight: {
    marginLeft: 'auto',
  },
  messageSkeletonCenter: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  messages: {
    backgroundColor: theme.colors['white'],
    flex: 1,
    padding: theme.space['4'],
  },
  inputWrapper: {
    backgroundColor: theme.colors['white'],
    paddingTop: theme.space['2'],
  },
  input: {
    alignItems: 'center',
    backgroundColor: theme.colors['white'],
    borderRadius: theme.radii['full'],
    paddingRight: theme.space['2'],
  },
  submitButton: {
    borderColor: 'transparent',
    borderRadius: theme.radii['full'],
    height: theme.space['8'],
    paddingHorizontal: theme.space['4'],
    width: theme.space['8'],
  },
  submitButtonIcon: {
    color: theme.colors['white'],
  },
}));
