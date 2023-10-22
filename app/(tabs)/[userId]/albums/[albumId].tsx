import { Dimensions, FlatList, TouchableOpacity, View, type ListRenderItemInfo } from 'react-native';

import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Fade, Placeholder, PlaceholderMedia } from 'rn-placeholder';

import { HStack, Image } from '&/components/core';
import { LoadingIndicator } from '&/components/shared';
import { getPostMediaByAlbumId } from '&/queries/post';
import { useUserStore } from '&/stores/user';
import { getPublicImageUrl } from '&/utils/getPublicImageUrl';
import { makeStyles } from '&/utils/makeStyles';

export default function AlbumId(): JSX.Element {
  const styles = useStyles();

  const user = useUserStore(state => state.user);
  if (!user) return <LoadingIndicator />;

  const { albumId } = useLocalSearchParams<{ albumId: string }>();

  const { data: album, isLoading: isLoadingAlbum } = useQuery({
    queryKey: ['album', albumId],
    queryFn: () => getPostMediaByAlbumId(albumId),
  });

  const { data: postMedia } = useQuery({
    queryKey: ['albumMedia', albumId],
    queryFn: async () => {
      if (!album) return;

      const albums = [];
      for (const albumPost of album) {
        for (const postMedia of albumPost.post_media) {
          albums.push({
            post_id: albumPost.id,
            file_url: await getPublicImageUrl('posts', postMedia.file_url),
            file_placeholder: postMedia.file_placeholder,
          });
        }
      }

      return albums;
    },
    enabled: !!album,
  });

  const renderItem = ({ item }: ListRenderItemInfo<{ post_id: string; file_url: string; file_placeholder: string }>): JSX.Element | null => {
    if (!postMedia) return null;

    return (
      <Link href={`/post/${item.post_id}`} asChild>
        <TouchableOpacity>
          <Image source={{ uri: item.file_url }} placeholder={item.file_placeholder} style={styles.album} />
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={styles.albums}>
      <StatusBar style="light" />

      {isLoadingAlbum ? (
        <Placeholder Animation={Fade}>
          <HStack style={styles.albumList}>
            {[...Array(21)].map((_, index: number) => (
              <PlaceholderMedia key={index} style={styles.album} />
            ))}
          </HStack>
        </Placeholder>
      ) : (
        <FlatList data={postMedia} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} numColumns={3} style={styles.albumList} />
      )}
    </View>
  );
}

const imageDimension = (Dimensions.get('window').width - 28) / 3;
const useStyles = makeStyles(theme => ({
  albums: {
    backgroundColor: theme.colors['white'],
    flex: 1,
  },
  albumList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.space['6'],
    marginHorizontal: theme.space['0.5'],
  },
  album: {
    height: imageDimension,
    marginHorizontal: theme.space['1'],
    marginVertical: theme.space['1'],
    width: imageDimension,
  },
}));
