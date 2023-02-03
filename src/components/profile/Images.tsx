import { Fragment, useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/core';

import { useCurrentUser } from '&/contexts/AuthProvider';
import { AppNavProps } from '&/navigators/app-navigator';
import { getPosts, type Post } from '&/queries/posts';
import { downloadSupabaseMedia } from '&/utilities/helpers';

export function Images(): JSX.Element {
  const user = useCurrentUser();
  const navigation = useNavigation<AppNavProps<'Post'>>();
  const [posts, setPosts] = useState<Post[] | null>();

  useEffect(() => {
    const getUsersPosts = async (): Promise<void> => {
      if (user.id) {
        const posts: Post[] | null = await getPosts(user.id);
        setPosts(posts);
      }
    };

    getUsersPosts();
  }, [user]);

  return (
    <View style={styles.container}>
      {posts?.map((post: Post, index: number) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Post', { account: user, post: post, startIndex: index })}
          key={post.location}
          style={[
            styles.imageContainer,
            index === 1 && {
              marginLeft: 2,
              marginRight: 2,
            },
          ]}
        >
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
const width = dimensions.width;

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
    width: width / 3,
  },
});
