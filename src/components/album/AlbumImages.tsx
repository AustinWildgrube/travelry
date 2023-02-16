import React, { Fragment } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useQuery } from '@tanstack/react-query';

import { type AppNavProps } from '&/navigators/root-navigator';
import { getPostsByAlbumId, type Post, type PostMedia } from '&/queries/posts';
import { downloadSupabaseMedia } from '&/utilities/helpers';

interface AlbumImagesProps {
  albumId: string;
  navigation: AppNavProps<'Post'>;
}

export function AlbumImages({ albumId, navigation }: AlbumImagesProps): JSX.Element {
  const { data } = useQuery({
    queryKey: ['albumImages', albumId],
    queryFn: () => getPostsByAlbumId(albumId),
  });

  return (
    <View style={styles.container}>
      {data?.map((post: Post, index: number) => (
        <Fragment key={post.created_at}>
          {post.post_media.map((media: PostMedia) => (
            <TouchableOpacity
              onPress={async () =>
                navigation.navigate('Post', {
                  accountId: post.account.id,
                  postId: post.id,
                  startIndex: 0,
                })
              }
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
            </TouchableOpacity>
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
