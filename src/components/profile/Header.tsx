import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '&/components/atoms';
import { type UserProfile } from '&/queries/users';
import { downloadSupabaseMedia } from '&/utilities/helpers';

interface HeaderProps {
  user: UserProfile;
}

export function Header({ user }: HeaderProps): JSX.Element {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (user.avatar_url) {
      setAvatarUrl(downloadSupabaseMedia('avatars', user.avatar_url));
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <Avatar src={avatarUrl} accessibilityLabel={`${user.full_name}'s profile image`} />
      <Text style={styles.fullName}>{user.full_name}</Text>
      <Text style={styles.bio}>{user.bio}</Text>

      <View style={styles.statsContainer}>
        <View style={{ alignItems: 'center', width: '33%' }}>
          <Text style={styles.statText}>Trips</Text>
          <Text style={styles.statNumber}>{user.account_stat.trip_count}</Text>
        </View>

        <View style={{ alignItems: 'center', width: '33%' }}>
          <Text style={styles.statText}>Followers</Text>
          <Text style={styles.statNumber}>{user.account_stat.followers_count}</Text>
        </View>

        <View style={{ alignItems: 'center', width: '33%' }}>
          <Text style={styles.statText}>Following</Text>
          <Text style={styles.statNumber}>{user.account_stat.following_count}</Text>
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
