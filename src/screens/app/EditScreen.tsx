import { RouteProp } from '@react-navigation/native';

import { Layout } from '&/components/atoms';
import { EditInputs } from '&/components/edit/EditInputs';
import { type AppStackParamList } from '&/navigators/root-navigator';

interface EditScreenProps {
  route: RouteProp<AppStackParamList, 'Edit'>;
}

export function EditScreen({ route }: EditScreenProps): JSX.Element {
  const { image } = route.params;

  return (
    <Layout>
      <EditInputs image={image} />
    </Layout>
  );
}
