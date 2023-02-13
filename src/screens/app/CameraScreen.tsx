import { useNavigation } from '@react-navigation/core';

import { Camera } from '&/components/camera';
import { AppNavProps } from '&/navigators/root-navigator';

export function CameraScreen(): JSX.Element {
  const navigation = useNavigation<AppNavProps<'Edit'>>();

  return <Camera navigation={navigation} />;
}
