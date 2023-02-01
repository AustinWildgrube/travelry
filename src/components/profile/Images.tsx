import { Fragment, useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/core';

import { useCurrentUser } from '&/contexts/AuthProvider';
import { AppNavProps } from '&/navigators/app-navigator';
import { getPosts, type Post } from '&/queries/posts';
import { downloadSupabaseMedia } from '&/utilities/helpers';

export function Images(): JSX.Element {
  const user = useCurrentUser();
  const navigation = useNavigation<AppNavProps<'Post'>>();
  const [posts, setPosts] = useState<Post[] | null>();

  const renderItem = ({ item, index }: { item: Post; index: number }): JSX.Element => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Post', { account: user, post: item, startIndex: index })}
        style={[
          styles.imageContainer,
          index === 1 && {
            marginLeft: 2,
            marginRight: 2,
          },
        ]}
        key={item.location}>
        <Image
          source={{ uri: downloadSupabaseMedia('posts', item.post_media[0].file_url) }}
          accessibilityLabel={`${item.location} album cover photo`}
          style={styles.image}
          key={item.post_media[0].id}
        />
      </TouchableOpacity>
    );
  };

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
    <Fragment>
      <FlatList data={posts} renderItem={renderItem} keyExtractor={item => item.location} numColumns={3} />
    </Fragment>
  );
}

const dimensions = Dimensions.get('window');
const height = Math.round((dimensions.width * 3) / 9);
const width = dimensions.width;

const styles = StyleSheet.create({
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
