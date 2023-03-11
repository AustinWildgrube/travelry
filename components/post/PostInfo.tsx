import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';

import { Avatar } from '&/components/atoms';
import { LikeButton } from '&/components/shared/LikeButton';
import { downloadSupabaseMedia, getRelativeTime } from '&/utilities/helpers';

interface PostInfoProps {
  accountId: string;
  accountAvatarUrl: string;
  accountFullName: string;
  postId: string;
  postCaption: string;
  postCreatedAt: string;
  postLikeCount: string;
}

export function PostInfo({
  accountId,
  accountAvatarUrl,
  accountFullName,
  postId,
  postCaption,
  postCreatedAt,
  postLikeCount,
}: PostInfoProps): JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.actionRow}>
        <Link href={`/profile/${accountId}`} style={styles.avatarContainer}>
          <Avatar src={downloadSupabaseMedia('avatars', accountAvatarUrl)} size={92} style={styles.avatarImage} />
        </Link>

        <View style={styles.actions}>
          <Pressable style={styles.actionButton}>
            <Feather name="map-pin" size={21} color="black" />
          </Pressable>

          <View style={styles.actionButton}>
            <LikeButton postId={postId} />
          </View>

          <Pressable style={styles.actionButton}>
            <Feather name="share" size={21} color="black" />
          </Pressable>
        </View>
      </View>

      <Link href={`/profile/${accountId}`}>
        <Text style={styles.name}>{accountFullName}</Text>
      </Link>

      <Text style={styles.description}>{postCaption}</Text>

      <Text style={styles.lapsedTime}>
        Posted {getRelativeTime(postCreatedAt)} &#x2022; <Text>{postLikeCount} likes</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  avatarContainer: {
    marginTop: -46,
  },
  avatarImage: {
    borderColor: '#fff',
    borderRadius: 50,
    borderStyle: 'solid',
    borderWidth: 2,
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 64,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    height: 44,
    justifyContent: 'center',
    marginTop: -22,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.15,
    shadowColor: '#102344',
    width: 44,
  },
  name: {
    fontSize: 21,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    marginVertical: 8,
  },
  lapsedTime: {
    color: '#7C8089',
    fontSize: 12,
    marginBottom: 21,
  },
});
