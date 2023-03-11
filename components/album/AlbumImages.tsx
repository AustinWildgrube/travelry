import React, { Fragment } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { getPostsByAlbumId, type Post, type PostMedia } from '&/queries/posts';
import { usePostStore } from '&/stores/post';
import { downloadSupabaseMedia } from '&/utilities/helpers';

interface AlbumImagesProps {
  albumId: string;
}

export function AlbumImages({ albumId }: AlbumImagesProps): JSX.Element {
  const router = useRouter();
  const setViewedPost = usePostStore(state => state.setViewedPost);

  const { data: albumImages } = useQuery({
    queryKey: ['albumImages', albumId],
    queryFn: () => getPostsByAlbumId(albumId),
  });

  const goToPost = async (post: Post): Promise<void> => {
    setViewedPost(post);
    router.push({
      pathname: '/post',
      params: {
        startIndex: 0,
      },
    });
  };

  return (
    <View style={styles.container}>
      {albumImages?.map((post: Post, index: number) => (
        <Fragment key={post.created_at}>
          {post.post_media.map((media: PostMedia) => (
            <Pressable
              onPress={() => goToPost(post)}
              style={[
                styles.imageContainer,
                index % 2 === 0 && {
                  marginLeft: 2,
                  marginRight: 2,
                },
              ]}
              key={media.id}>
              <Image
                source={{ uri: downloadSupabaseMedia('posts', media.file_url) }}
                accessibilityLabel={`Post image`}
                style={styles.image}
              />
            </Pressable>
          ))}
        </Fragment>
      ))}
    </View>
  );
}

const dimensions = Dimensions.get('window');
const height = Math.round((dimensions.width * 3) / 9);
const width = Math.round(dimensions.width - 40);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 16,
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
