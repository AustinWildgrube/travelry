import { useNavigation } from '@react-navigation/core';
import { type RouteProp } from '@react-navigation/native';

import { AlbumImages } from '&/components/album/AlbumImages';
import { type AppNavProps, type AppStackParamList } from '&/navigators/app-navigator';

interface AlbumScreenProps {
  route: RouteProp<AppStackParamList, 'Album'>;
}

export function AlbumScreen({ route }: AlbumScreenProps): JSX.Element {
  const navigation = useNavigation<AppNavProps<'Post'>>();
  const { albumId } = route.params;

  return <AlbumImages albumId={albumId} navigation={navigation} />;
}
