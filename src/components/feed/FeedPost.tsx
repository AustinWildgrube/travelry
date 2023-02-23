import { Dimensions, Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/core';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';

import { LikeButton } from '&/components/shared/LikeButton';
import { type AppNavProps } from '&/navigators/root-navigator';
import { getPostById, type Post } from '&/queries/posts';
import { getUserProfile } from '&/queries/users';
import { useUserStore } from '&/stores/user';
import { downloadSupabaseMedia } from '&/utilities/helpers';

interface PostProps {
  postId: string;
}

export function FeedPost({ postId }: PostProps): JSX.Element {
  const setViewedUser = useUserStore(state => state.setViewedUser);
  const navigation = useNavigation<AppNavProps<'Post'>>();

  const { data: post } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  });

  const goToPost = async (post: Post): Promise<void> => {
    navigation.navigate('Post', {
      accountId: post.account.id,
      postId: post.id,
      startIndex: 0,
    });
  };

  const goToAccount = async (accountId: string): Promise<void> => {
    setViewedUser(await getUserProfile(accountId));
    navigation.navigate('Tabs', {
      screen: 'ProfileTab',
      params: {
        screen: 'Profile',
      },
    });
  };

  return (
    <>
      {post && (
        <Pressable onPress={() => goToPost(post)} style={styles.post} key={post.created_at}>
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
                <Pressable onPress={() => goToAccount(post.account.id)} style={styles.headerInfo}>
                  <Image
                    source={{ uri: downloadSupabaseMedia('avatars', post.account.avatar_url) }}
                    style={styles.accountAvatar}
                  />

                  <View>
                    <Text style={styles.accountName}>{post.account?.full_name}</Text>
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
      )}
    </>
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
  headerInfo: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  accountAvatar: {
    borderRadius: 50,
    height: 32,
    marginRight: 8,
    width: 32,
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
