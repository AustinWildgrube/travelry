import { Fragment, useEffect, useState } from 'react';
import { Dimensions, FlatList, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/core';
import { Image } from 'tamagui';

import { useCurrentUser } from '&/contexts/auth-provider';
import { AppNavProps } from '&/navigators/app-navigator';
import { PostMedia, getPosts, type Post } from '&/queries/posts';
import { downloadSupabaseMedia } from '&/utilities/helpers';

const dimensions = Dimensions.get('window');
const height = Math.round((dimensions.width * 3) / 9);
const width = dimensions.width;

export function Images(): JSX.Element {
  const user = useCurrentUser();
  const navigation = useNavigation<AppNavProps<'Post'>>();
  const [posts, setPosts] = useState<Post[] | null>();

  // const combineMediaByLocation = (posts: Post[]): Post[] => {
  //   const result = new Map<string, Post>();
  //   posts.reduce((object: Map<string, Post>, post: Post) => {
  //     const { location, post_media } = post;
  //     if (object.has(location)) {
  //       object.get(location)?.post_media.push(...post_media);
  //     } else {
  //       object.set(location, { location, post_media });
  //     }
  //
  //     return object;
  //   }, result);
  //
  //   return [...result.values()];
  // };

  const renderItem = ({ item }: { item: Post }): JSX.Element => {
    return (
      <>
        {posts &&
          posts.map((post: Post) => (
            <>
              {item.post_media.map((media: PostMedia, index: number) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Post', { account: user, post: post, startIndex: index })}
                  style={[
                    { marginBottom: 2, width: width / 3 },
                    index === 1 && {
                      marginLeft: 2,
                      marginRight: 2,
                    },
                  ]}
                  key={media.id}>
                  <Image
                    src={downloadSupabaseMedia('posts', media.file_url)}
                    height={height}
                    width={width / 3}
                    key={media.id}
                    style={{ borderRadius: 4 }}
                  />
                </TouchableOpacity>
              ))}
            </>
          ))}
      </>
    );
  };

  useEffect(() => {
    const getUsersPosts = async (): Promise<void> => {
      if (user.id) {
        const posts: Post[] | null = await getPosts(user.id);
        setPosts(posts);
        // if (posts) {
        // const combinedPosts: Post[] = combineMediaByLocation(posts);
        // setPosts(combinedPosts);
        // }
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
