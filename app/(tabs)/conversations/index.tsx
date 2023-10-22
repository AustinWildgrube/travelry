import { FlatList, TouchableOpacity, View } from 'react-native';

import { useQuery } from '@tanstack/react-query';
import { Link, Stack } from 'expo-router';
import { PlusCircleIcon } from 'lucide-react-native';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';

import { Conversation } from '&/components/conversations/Conversation';
import { Center, Heading, Icon } from '&/components/core';
import { Header, LoadingIndicator } from '&/components/shared';
import { getConversations } from '&/queries/message';
import { useUserStore } from '&/stores/user';
import { makeStyles } from '&/utils/makeStyles';

export default function Conversations(): JSX.Element {
  const styles = useStyles();

  const user = useUserStore(state => state.user);
  if (!user) return <LoadingIndicator />;

  const {
    data: conversations,
    isLoading: isLoadingConversations,
    refetch: refetchConversations,
    isRefetching: isRefetchingConversations,
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => getConversations(user.id),
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => <Header />,
          headerBackTitle: 'All Messages',
          headerRight: () => (
            <Link href={`/(tabs)/conversations/recipients`} asChild>
              <TouchableOpacity>
                <Icon as={PlusCircleIcon} size={24} style={styles.headerIcon} />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />

      {isLoadingConversations && (
        <View style={styles.conversationsSkeletonWrapper}>
          {[...Array(14)].map((_, index: number) => (
            <Placeholder Animation={Fade} Left={PlaceholderMedia} key={index} style={styles.conversationsSkeleton}>
              <PlaceholderLine width={80} />
              <PlaceholderLine width={50} />
            </Placeholder>
          ))}
        </View>
      )}

      {!isLoadingConversations && conversations && conversations.length === 0 && (
        <Center style={styles.conversationsEmptyState}>
          <Heading>You have no messages!</Heading>
        </Center>
      )}

      {!isLoadingConversations && conversations && conversations.length > 0 && (
        <FlatList
          data={conversations}
          renderItem={({ item }) => <Conversation conversation={item} />}
          refreshing={isRefetchingConversations}
          onRefresh={refetchConversations}
          style={styles.conversations}
        />
      )}
    </>
  );
}

const useStyles = makeStyles(theme => ({
  headerIcon: {
    color: theme.colors['black'],
  },
  conversationsSkeletonWrapper: {
    backgroundColor: theme.colors['white'],
    padding: theme.space['4'],
  },
  conversationsSkeleton: {
    marginBottom: theme.space['3'],
  },
  conversationsEmptyState: {
    backgroundColor: theme.colors['white'],
    flex: 1,
  },
  conversations: {
    backgroundColor: theme.colors['white'],
  },
}));
