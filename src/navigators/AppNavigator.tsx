import { FC } from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileScreen } from 'src/screens/app/ProfileScreen';
import { useCurrentUser } from '../contexts/AuthProvider';

export type AppStackParamList = {
  Profile: undefined;
};

export type AppNavProps<T extends keyof AppStackParamList> = NativeStackNavigationProp<AppStackParamList, T>;

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: FC = (): JSX.Element => {
  const user = useCurrentUser();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'Profile'}
        component={ProfileScreen}
        options={{
          headerShown: true,
          title: `@${user.username}`,
        }}
      />
    </Stack.Navigator>
  );
};
