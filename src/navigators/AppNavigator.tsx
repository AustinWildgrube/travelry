import { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileScreen } from 'src/screens/app/ProfileScreen';
import { useCurrentUser } from '../contexts/AuthProvider';
import { User } from '@tamagui/lucide-icons';

export type AppStackParamList = {
  Profile: undefined;
};

export type AppNavProps<T extends keyof AppStackParamList> = NativeStackNavigationProp<AppStackParamList, T>;

const Tab = createBottomTabNavigator();

export const AppNavigator: FC = (): JSX.Element => {
  const user = useCurrentUser();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          title: `@${user.username}`,
          tabBarLabel: 'Profile',
          tabBarIcon: ({}) => <User />,
        }}
      />
    </Tab.Navigator>
  );
};
