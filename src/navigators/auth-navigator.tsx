import { FC } from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthenticationScreen } from '&/screens/authentication/AuthenticationScreen';

export type AuthStackParamList = {
  Login: undefined;
};

export type AuthNavProps<T extends keyof AuthStackParamList> = NativeStackNavigationProp<AuthStackParamList, T>;

const Stack = createNativeStackNavigator();

export const AuthNavigator: FC = (): JSX.Element => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'Login'}
        component={AuthenticationScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
