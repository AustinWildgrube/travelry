import { FlatList, StyleSheet, Text, View } from 'react-native';

import { useQuery } from '@tanstack/react-query';

import { getUserFollowing } from '&/queries/users';

import { ProfileUserItem } from './ProfileUserItem';

interface ProfileFollowersProps {
  userName: string;
  userId: string;
}

export function ProfileFollowing({ userName, userId }: ProfileFollowersProps): JSX.Element {
  const { data: following } = useQuery({
    queryKey: ['following', userId],
    queryFn: () => getUserFollowing(userId),
  });

  return (
    <>
      {following && following.length > 0 ? (
        <FlatList
          data={following}
          renderItem={({ item }) => <ProfileUserItem id={item.id} account={item.account} />}
          keyExtractor={item => item.id}
          style={{ backgroundColor: 'white' }}
        />
      ) : (
        <View style={styles.noFollows}>
          <Text style={styles.noFollowsText}>{userName} is not following anyone.</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  noFollows: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  noFollowsText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
