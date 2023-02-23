import { StyleSheet, Text, View } from 'react-native';

import { useQuery } from '@tanstack/react-query';

import { Avatar } from '&/components/atoms';
import { useUserStore } from '&/stores/user';
import { downloadSupabaseMedia } from '&/utilities/helpers';

export function ProfileHeader(): JSX.Element {
  const viewedUser = useUserStore(state => state.viewedUser);

  const { data } = useQuery({
    queryKey: ['avatar', viewedUser.id],
    queryFn: () => downloadSupabaseMedia('avatars', viewedUser.avatar_url),
  });

  return (
    <View style={styles.container}>
      <Avatar src={data} accessibilityLabel={`${viewedUser.full_name}'s profile image`} />
      <Text style={styles.fullName}>{viewedUser.full_name}</Text>
      <Text style={styles.bio}>{viewedUser.bio}</Text>

      <View style={styles.statsContainer}>
        <View style={{ alignItems: 'center', width: '33%' }}>
          <Text style={styles.statText}>Trips</Text>
          <Text style={styles.statNumber}>{viewedUser.account_stat.trip_count}</Text>
        </View>

        <View style={{ alignItems: 'center', width: '33%' }}>
          <Text style={styles.statText}>Followers</Text>
          <Text style={styles.statNumber}>{viewedUser.account_stat.followers_count}</Text>
        </View>

        <View style={{ alignItems: 'center', width: '33%' }}>
          <Text style={styles.statText}>Following</Text>
          <Text style={styles.statNumber}>{viewedUser.account_stat.following_count}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 21,
    justifyContent: 'center',
  },
  fullName: {
    fontSize: 21,
    fontWeight: '600',
    marginTop: 16,
  },
  bio: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  editButton: {
    fontSize: 12,
    marginTop: 16,
  },
  statsContainer: {
    alignItems: 'center',
    borderBottomColor: '#e1e1e1',
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 32,
    paddingBottom: 32,
    width: '100%',
  },
  statText: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  statNumber: {
    fontSize: 18,
    textAlign: 'center',
  },
});
