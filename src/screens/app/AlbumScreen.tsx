import { type RouteProp } from '@react-navigation/native';

import { AlbumImages } from '&/components/album/AlbumImages';
import { type ProfileStackParamList } from '&/navigators/profile-navigator';

interface AlbumScreenProps {
  route: RouteProp<ProfileStackParamList, 'Album'>;
}

export function AlbumScreen({ route }: AlbumScreenProps): JSX.Element {
  const { albumId } = route.params;

  return <AlbumImages albumId={albumId} />;
}
