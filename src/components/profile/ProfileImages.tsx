import { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { type AppNavProps } from '&/navigators/root-navigator';
import { getAlbumsByAccountId, type Album } from '&/queries/albums';
import { type UserProfile } from '&/queries/users';
import { downloadSupabaseMedia } from '&/utilities/helpers';

interface ImageProps {
  navigation: AppNavProps<'Tabs' | 'Post'>;
  setViewedAlbum: (album: Album) => void;
  user: UserProfile;
}

export function ProfileImages({ navigation, setViewedAlbum, user }: ImageProps): JSX.Element {
  const [albums, setAlbums] = useState<Album[]>();

  const goToAlbum = (album: Album): void => {
    setViewedAlbum(album);
    navigation.navigate('Tabs', {
      screen: 'ProfileTab',
      params: {
        screen: 'Album',
        params: {
          albumId: album.id,
        },
      },
    });
  };

  useEffect(() => {
    const getUsersAlbums = async (): Promise<void> => {
      if (user.id) {
        setAlbums(await getAlbumsByAccountId(user.id));
      }
    };

    getUsersAlbums();
  }, [user]);

  return (
    <View style={styles.container}>
      {albums?.map((album: Album, index: number) => (
        <TouchableOpacity
          onPress={() => goToAlbum(album)}
          key={album.name}
          style={[
            styles.imageContainer,
            index % 2 === 0 && {
              marginLeft: 2,
              marginRight: 2,
            },
          ]}>
          <Image
            source={{ uri: downloadSupabaseMedia('posts', album.cover.file_url) }}
            accessibilityLabel={`${album.name} album cover photo`}
            style={styles.image}
            key={album.id}
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
