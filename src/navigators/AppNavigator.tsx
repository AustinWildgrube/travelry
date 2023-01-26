import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileScreen } from 'src/screens/app/ProfileScreen';

export type AppStackParamList = {
  Home: undefined;
};

export type AppNavProps<T extends keyof AppStackParamList> = NativeStackNavigationProp<AppStackParamList, T>;

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'Home'}
        component={ProfileScreen}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};
