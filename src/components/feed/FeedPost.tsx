import { useEffect, useState } from 'react';
import { Dimensions, Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import { Heart } from '@tamagui/lucide-icons';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';

import { AppNavProps } from '&/navigators/root-navigator';
import { getAlbumsByAccountId } from '&/queries/albums';
import { getAllPosts, type Post } from '&/queries/posts';
import { getUserProfile, type UserProfile } from '&/queries/users';
import { downloadSupabaseMedia } from '&/utilities/helpers';

interface PostProps {
  navigation: AppNavProps<'Post'>;
  setViewedUser: (user: UserProfile) => void;
}

const dimensions = Dimensions.get('window');
const height = Math.round(dimensions.width);
const width = Math.round(dimensions.width - 24);

export function FeedPost({ navigation, setViewedUser }: PostProps): JSX.Element {
  const { data } = useQuery({
    queryKey: ['feedPosts'],
    queryFn: () => getAllPosts(),
  });

  const goToPost = async (post: Post): Promise<void> => {
    navigation.navigate('Post', { account: await getUserProfile(post.account.id), post: post, startIndex: 0 });
  };

  const goToAccount = async (account: UserProfile): Promise<void> => {
    setViewedUser(await getUserProfile(account.id));
    navigation.navigate('Tabs', {
      screen: 'ProfileTab',
      params: {
        screen: 'Profile',
      },
    });
  };

  return (
    <>
      {data &&
        data.map((post: Post) => (
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
                  <Pressable onPress={() => goToAccount(post.account)} style={styles.headerInfo}>
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
                    <Heart size={21} color="#7C8089" />
                    <Text style={styles.likeAmount}>15</Text>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </Pressable>
        ))}
    </>
  );
}

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
  likeAmount: {
    color: '#7C8089',
    marginLeft: 8,
  },
});
