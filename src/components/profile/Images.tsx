import { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppNavProps } from '&/navigators/app-navigator';
import { getPostsByAccountId, type Post } from '&/queries/posts';
import { UserProfile } from '&/queries/users';
import { downloadSupabaseMedia } from '&/utilities/helpers';

interface ImageProps {
  navigation: AppNavProps<'Post' | 'Profile'>;
  user: UserProfile;
}

export function Images({ navigation, user }: ImageProps): JSX.Element {
  const [posts, setPosts] = useState<Post[] | null>();

  useEffect(() => {
    const getUsersPosts = async (): Promise<void> => {
      if (user.id) {
        const posts: Post[] | null = await getPostsByAccountId(user.id);
        setPosts(posts);
      }
    };

    getUsersPosts();
  }, [user]);

  return (
    <View style={styles.container}>
      {posts?.map((post: Post, index: number) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Post', { account: user, post: post, startIndex: 0 })}
          key={post.location}
          style={[
            styles.imageContainer,
            index % 2 === 0 && {
              marginLeft: 2,
              marginRight: 2,
            },
          ]}>
          <Image
            source={{ uri: downloadSupabaseMedia('posts', post.post_media[0].file_url) }}
            accessibilityLabel={`${post.location} album cover photo`}
            style={styles.image}
            key={post.post_media[0].id}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const dimensions = Dimensions.get('window');
const height = Math.round((dimensions.width * 3) / 9);
const width = Math.round(dimensions.width - 40);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  imageContainer: {
    marginBottom: 2,
    width: width / 3,
  },
  image: {
    borderRadius: 4,
    height: height,
    width: '100%',
  },
});
