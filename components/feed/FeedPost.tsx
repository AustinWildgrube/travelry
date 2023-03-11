import { Dimensions, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
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
      <ImageBackground
        source={{ uri: downloadSupabaseMedia('posts', post.post_media[0].file_url) }}
        imageStyle={styles.imageBackground}
        style={styles.imageBackgroundContainer}>
        <LinearGradient
          colors={['white', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0.85 }}
          end={{ x: 0, y: 0.7 }}
          style={styles.linearGradient}>
          <View style={styles.header}>
            <Pressable onPress={() => router.push(`/profile/${post.account.id}`)} style={styles.headerLink}>
              <Avatar
                src={downloadSupabaseMedia('avatars', post.account.avatar_url)}
                size={36}
                style={styles.accountAvatar}
              />

              <View>
                <Text style={styles.accountName}>{post.account.full_name}</Text>
                <Text style={styles.location}>{post.location}</Text>
              </View>
            </Pressable>

            <View style={styles.likeButton}>
              <LikeButton likeCount={post.post_stat.likes_count} postId={post.id} />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}

const dimensions = Dimensions.get('window');
const height = Math.round(dimensions.width);
const width = Math.round(dimensions.width - 24);

const styles = StyleSheet.create({
  post: {
    marginBottom: 12,
  },
  imageBackground: {
    borderRadius: 4,
  },
  imageBackgroundContainer: {
    backgroundColor: '#fff',
    borderRadius: 4,
    elevation: 1,
    height: height - 24,
    justifyContent: 'flex-end',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    width: width - 2,
  },
  linearGradient: {
    borderRadius: 4,
    height: height,
    padding: 8,
  },
  header: {
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  headerLink: {
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
  location: {
    color: '#7C8089',
  },
  likeButton: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
