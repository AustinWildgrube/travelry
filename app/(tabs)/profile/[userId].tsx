import { ScrollView, StyleSheet, Text } from 'react-native';

import { useQuery } from '@tanstack/react-query';
import { Stack, useSearchParams } from 'expo-router';

import { ProfileAlbums, ProfileFollowButton, ProfileHeader } from '&/components/profile';
import { getUserProfile } from '&/queries/users';

export default function UserId(): JSX.Element {
  const { userId }: Partial<{ userId: string }> = useSearchParams();

  if (!userId) {
    return <Text>There was an error</Text>;
  }

  const { data: account, isLoading: isLoadingAccount } = useQuery({
    queryKey: ['account', userId],
    queryFn: () => getUserProfile(userId as string),
  });

  return (
    <>
      {account && !isLoadingAccount && (
        <ScrollView style={styles.container}>
          <ProfileHeader
            id={account.id}
            avatar_url={account.avatar_url}
            full_name={account.full_name}
            bio={account.bio}
            followers_count={account.account_stat.followers_count}
            following_count={account.account_stat.following_count}
            trip_count={account.account_stat.trip_count}
          />

          <ProfileAlbums accountId={account.id} />
          <Stack.Screen
            options={{
              headerTitle: `@${account.username}`,
              headerBackVisible: true,
              headerRight: () => <ProfileFollowButton viewedUserId={userId} />,
            }}
          />
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});
