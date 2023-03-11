import { Text } from 'react-native';

import { Stack, useSearchParams } from 'expo-router';

import { AlbumImages } from '&/components/album/AlbumImages';

export default function AlbumId(): JSX.Element {
  const { albumId, albumName }: Partial<{ albumId: string; albumName: string }> = useSearchParams();

  if (!albumId || !albumName) {
    return <Text>There was an error</Text>;
  }

  return (
    <>
      <AlbumImages albumId={albumId as string} />
      <Stack.Screen options={{ title: albumName }} />
    </>
  );
}
