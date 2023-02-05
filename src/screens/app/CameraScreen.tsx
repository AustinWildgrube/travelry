import { useNavigation } from '@react-navigation/core';

import { Camera } from '&/components/camera';
import { AppNavProps } from '&/navigators/app-navigator';

export function CameraScreen(): JSX.Element {
  const navigation = useNavigation<AppNavProps<'Profile'>>();

  return <Camera navigation={navigation} />;
}
