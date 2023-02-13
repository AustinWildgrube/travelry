import { useNavigation } from '@react-navigation/core';
import { RouteProp } from '@react-navigation/native';

import { Layout } from '&/components/atoms';
import { EditInputs } from '&/components/edit/EditInputs';
import { type AppNavProps, type AppStackParamList } from '&/navigators/root-navigator';
import { useUserStore } from '&/stores/user';

interface EditScreenProps {
  route: RouteProp<AppStackParamList, 'Edit'>;
}

export function EditScreen({ route }: EditScreenProps): JSX.Element {
  const setViewedUser = useUserStore(state => state.setViewedUser);
  const navigation = useNavigation<AppNavProps<'Tabs'>>();
  const { image } = route.params;

  return (
    <Layout>
      <EditInputs image={image} navigation={navigation} setViewedUser={setViewedUser} />
    </Layout>
  );
}
