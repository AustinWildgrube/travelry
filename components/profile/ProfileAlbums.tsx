import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { getAlbumsByAccountId, type Album } from '&/queries/albums';
import { downloadSupabaseMedia } from '&/utilities/helpers';

interface ProfileAlbumProps {
  accountId: string;
}

export function ProfileAlbums({ accountId }: ProfileAlbumProps): JSX.Element {
  const router = useRouter();

  const { data: albums } = useQuery({
    queryKey: ['albums', accountId],
    queryFn: () => getAlbumsByAccountId(accountId),
  });

  return (
    <View style={styles.container}>
      {albums?.map((album: Album, index: number) => (
        <Pressable
          onPress={() =>
            router.push({
              pathname: `/profile/album/${album.id}`,
              params: { albumName: album.name },
            })
          }
          style={[
            styles.imageContainer,
            index % 2 === 0 && {
              marginLeft: 2,
              marginRight: 2,
            },
          ]}
          key={album.name}>
          <Image
            source={{ uri: downloadSupabaseMedia('posts', album.cover.file_url) }}
            accessibilityLabel={`${album.name} album cover photo`}
            style={styles.image}
            key={album.id}
          />
        </Pressable>
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
    height: height,
    width: width / 3,
  },
  image: {
    borderRadius: 4,
    height: height,
    width: '100%',
  },
});
