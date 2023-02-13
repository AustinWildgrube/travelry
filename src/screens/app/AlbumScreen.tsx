import { useNavigation } from '@react-navigation/core';
import { type RouteProp } from '@react-navigation/native';

import { AlbumImages } from '&/components/album/AlbumImages';
import { type ProfileStackParamList } from '&/navigators/profile-navigator';
import { type AppNavProps } from '&/navigators/root-navigator';

interface AlbumScreenProps {
  route: RouteProp<ProfileStackParamList, 'Album'>;
}

export function AlbumScreen({ route }: AlbumScreenProps): JSX.Element {
  const navigation = useNavigation<AppNavProps<'Post'>>();
  const { albumId } = route.params;

  return <AlbumImages albumId={albumId} navigation={navigation} />;
}
