import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useRouter } from 'expo-router';

import { Avatar } from '&/components/atoms';
import { LikeButton } from '&/components/shared/LikeButton';
import { type Post } from '&/queries/posts';
import { usePostStore } from '&/stores/post';
import { downloadSupabaseMedia } from '&/utilities/helpers';

interface PostProps {
  post: Post;
}

export function FeedPost({ post }: PostProps): JSX.Element {
  const router = useRouter();
  const setViewedPost = usePostStore(state => state.setViewedPost);

  const goToPost = async (): Promise<void> => {
    setViewedPost(post);
    router.push({
      pathname: '/post',
      params: {
        startIndex: 0,
      },
    });
  };

  return (
    <Pressable onPress={() => goToPost()} style={styles.post} key={post.created_at}>
      <Image source={{ uri: downloadSupabaseMedia('posts', post.post_media[0].file_url) }} style={styles.postImage} />

      <View style={styles.postInfo}>
        <Pressable onPress={() => router.push(`/profile/${post.account.id}`)} style={styles.postAccount}>
          <Avatar
            src={downloadSupabaseMedia('avatars', post.account.avatar_url)}
            size={36}
            style={styles.accountAvatar}
          />

          <View>
            <Text style={styles.accountName}>{post.account.full_name}</Text>
            <Text style={styles.postLocation}>{post.location}</Text>
          </View>
        </Pressable>

        <View style={styles.likeButton}>
          <LikeButton likeCount={post.post_stat.likes_count} postId={post.id} />
        </View>
      </View>
    </Pressable>
  );
}

const dimensions = Dimensions.get('window');
const height = Math.round(dimensions.width);
const width = Math.round(dimensions.width - 24);

const styles = StyleSheet.create({
  post: {
    backgroundColor: '#fff',
    borderRadius: 4,
    elevation: 2,
    marginHorizontal: 12,
    marginTop: 21,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  postImage: {
    borderRadius: 4,
    height: height / 1.5,
    width: width - 16,
  },
  postInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    marginTop: 12,
    paddingRight: 8,
  },
  postAccount: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  accountAvatar: {
    marginRight: 8,
  },
  accountName: {
    color: '#0C0F14',
    fontSize: 14,
    fontWeight: '600',
  },
  postLocation: {
    color: '#7C8089',
  },
  likeButton: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
