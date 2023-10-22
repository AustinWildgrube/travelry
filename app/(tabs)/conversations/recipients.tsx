import { Fragment, useEffect, useState } from 'react';
import { FlatList, Keyboard, View } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useForm } from 'react-hook-form';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { useDebounce } from 'use-debounce';
import { z } from 'zod';

import { MemoizedRecipient } from '&/components/conversations/Recipient';
import { Center, HStack, Heading, Input, Text } from '&/components/core';
import { LoadingIndicator } from '&/components/shared';
import { getUserAccountSearch, getUserFollowing } from '&/queries/user';
import { useMessageStore } from '&/stores/message';
import { useUserStore } from '&/stores/user';
import { makeStyles } from '&/utils/makeStyles';

const RecipientFormSchema = z.object({
  recipients: z.array(z.string()),
});

export default function Recipients(): JSX.Element {
  const styles = useStyles();

  const chosenRecipients = useMessageStore(state => state.chosenRecipients);
  const user = useUserStore(state => state.user);
  if (!user) return <LoadingIndicator />;

  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, 500);

  const { data: following, isLoading: isLoadingFollowing } = useQuery({
    queryKey: ['following', user.id],
    queryFn: () => getUserFollowing(user.id),
  });

  // TODO: change to useInfiniteQuery
  const {
    data: recipientSearch,
    isLoading: isLoadingRecipientSearch,
    refetch: refetchRecipientSearch,
    isRefetching: isRefetchingRecipientSearch,
  } = useQuery({
    queryKey: ['recipientSearch'],
    queryFn: () => getUserAccountSearch(debouncedSearchText),
    enabled: false,
  });

  // TODO: maybe remove this?
  const { control } = useForm<any>({
    resolver: zodResolver(RecipientFormSchema),
  });

  useEffect(() => {
    // keep recipient search from running every keystroke
    if (debouncedSearchText) refetchRecipientSearch();
  }, [debouncedSearchText]);

  return (
    <View style={styles.recipients}>
      <StatusBar style="light" />

      {isLoadingRecipientSearch && !isRefetchingRecipientSearch && isLoadingFollowing ? (
        [...Array(14)].map((_, index: number) => (
          <Placeholder Animation={Fade} Left={PlaceholderMedia} key={index} style={styles.recipientsSkeleton}>
            <PlaceholderLine width={80} />
            <PlaceholderLine width={50} />
          </Placeholder>
        ))
      ) : (
        <Fragment>
          <Input variant="rounded">
            <Input.Input placeholder="Search by name or username" onChangeText={value => setSearchText(value)} />
          </Input>

          <HStack style={styles.recipientsHeading}>
            <Heading size="sm">Suggestions</Heading>
            <Text>{chosenRecipients.length} Selected</Text>
          </HStack>

          {isLoadingRecipientSearch && isRefetchingRecipientSearch && <LoadingIndicator />}

          {!isLoadingRecipientSearch && recipientSearch && recipientSearch.length === 0 && (
            <Center style={styles.recipientsEmptyState}>
              <Heading>No users found</Heading>
            </Center>
          )}

          {!isLoadingRecipientSearch && recipientSearch && recipientSearch.length > 0 && (
            <FlatList
              data={recipientSearch}
              showsVerticalScrollIndicator={false}
              onScrollBeginDrag={() => Keyboard.dismiss()}
              renderItem={({ item }) => <MemoizedRecipient formControl={control} user={item} />}
            />
          )}

          {!isLoadingFollowing && following && !recipientSearch && (
            <FlatList
              data={following}
              showsVerticalScrollIndicator={false}
              onScrollBeginDrag={() => Keyboard.dismiss()}
              renderItem={({ item }) => <MemoizedRecipient formControl={control} user={item.account} />}
            />
          )}
        </Fragment>
      )}
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  recipientsSkeleton: {
    marginBottom: theme.space['3'],
  },
  recipientsEmptyState: {
    flex: 1,
  },
  recipients: {
    backgroundColor: theme.colors['white'],
    flex: 1,
    padding: theme.space['4'],
  },
  recipientsHeading: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.space['4'],
  },
}));
