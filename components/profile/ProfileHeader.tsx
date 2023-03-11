import { StyleSheet, Text, View } from 'react-native';

import { useQuery } from '@tanstack/react-query';

import { Avatar } from '&/components/atoms';
import { downloadSupabaseMedia } from '&/utilities/helpers';

interface ProfileHeaderProps {
  id: string;
  full_name: string;
  avatar_url: string;
  bio: string | null;
  followers_count: number;
  following_count: number;
  trip_count: number;
}

export function ProfileHeader({
  avatar_url,
  bio,
  followers_count,
  following_count,
  full_name,
  id,
  trip_count,
}: ProfileHeaderProps): JSX.Element {
  const { data } = useQuery({
    queryKey: ['avatar', id],
    queryFn: () => downloadSupabaseMedia('avatars', avatar_url),
  });

  return (
    <View style={styles.container}>
      <Avatar src={data} accessibilityLabel={`${full_name}'s profile image`} />
      <Text style={styles.fullName}>{full_name}</Text>
      <Text style={styles.bio}>{bio}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statText}>Trips</Text>
          <Text style={styles.statNumber}>{trip_count}</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statText}>Followers</Text>
          <Text style={styles.statNumber}>{followers_count}</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statText}>Following</Text>
          <Text style={styles.statNumber}>{following_count}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 21,
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
  stat: {
    alignItems: 'center',
    width: '33%',
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
