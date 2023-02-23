import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Feather } from '@expo/vector-icons';

import { AccountButton } from '&/components/shared/AccountButton';
import { LikeButton } from '&/components/shared/LikeButton';
import { type Post } from '&/queries/posts';
import { type UserProfile } from '&/queries/users';
import { downloadSupabaseMedia, getRelativeTime } from '&/utilities/helpers';

import { Avatar } from '../atoms';

interface PostInfoProps {
  account: UserProfile;
  post: Post;
}

export function PostInfo({ account, post }: PostInfoProps): JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.actionRow}>
        <AccountButton accountId={account.id}>
          <Avatar src={downloadSupabaseMedia('avatars', account.avatar_url)} size={92} style={styles.avatarImage} />
        </AccountButton>

        <View style={styles.actions}>
          <Pressable style={styles.actionButton}>
            <Feather name="map-pin" size={21} color="black" />
          </Pressable>

          <View style={styles.actionButton}>
            <LikeButton postId={post.id} />
          </View>

          <Pressable style={styles.actionButton}>
            <Feather name="share" size={21} color="black" />
          </Pressable>
        </View>
      </View>

      <AccountButton accountId={account.id}>
        <Text style={styles.name}>{account.full_name}</Text>
      </AccountButton>

      <Text style={styles.description}>{post.caption}</Text>

      <Text style={styles.lapsedTime}>
        Posted {getRelativeTime(post.created_at)} &#x2022; <Text>{post.post_stat.likes_count} likes</Text>
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
  },
  avatarImage: {
    borderColor: '#fff',
    borderRadius: 50,
    borderStyle: 'solid',
    borderWidth: 2,
    marginTop: -46,
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
    marginTop: 8,
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
