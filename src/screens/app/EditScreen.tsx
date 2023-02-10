import { useNavigation } from '@react-navigation/core';
import { RouteProp } from '@react-navigation/native';

import { Layout } from '&/components/atoms';
import { EditInputs } from '&/components/edit/EditInputs';
import { AppNavProps, AppStackParamList } from '&/navigators/app-navigator';

interface EditScreenProps {
  route: RouteProp<AppStackParamList, 'Edit'>;
}

export function EditScreen({ route }: EditScreenProps): JSX.Element {
  const navigation = useNavigation<AppNavProps<'Profile'>>();
  const { image } = route.params;

  return (
    <Layout>
      <EditInputs image={image} navigation={navigation} />
    </Layout>
  );
}
