import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { useQuery } from '@tanstack/react-query';

import { ProfileUserItem } from '&/components/profile/ProfileUserItem';
import { getUserFollowers } from '&/queries/users';

interface ProfileFollowersProps {
  userName: string;
  userId: string;
}

export function ProfileFollowers({ userName, userId }: ProfileFollowersProps): JSX.Element {
  const { data: followers, isLoading: isLoadingFollowers } = useQuery({
    queryKey: ['followers', userId],
    queryFn: () => getUserFollowers(userId),
  });

  return (
    <>
      {!isLoadingFollowers ? (
        <>
          {followers && followers.length > 0 ? (
            <FlatList
              data={followers}
              renderItem={({ item }) => <ProfileUserItem id={item.id} account={item.account} />}
              keyExtractor={item => item.id}
              style={{ backgroundColor: 'white' }}
            />
          ) : (
            <View style={styles.noFollows}>
              <Text style={styles.noFollowsText}>{userName} has no followers.</Text>
              <Text style={styles.noFollowsText}>Be the first!</Text>
            </View>
          )}
        </>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  noFollows: {
    flex: 1,
    justifyContent: 'center',
  },
  noFollowsText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
});
