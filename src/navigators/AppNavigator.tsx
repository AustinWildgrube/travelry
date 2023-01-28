import { FC } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Camera, User } from '@tamagui/lucide-icons';

import { ProfileScreen } from 'src/screens/app/ProfileScreen';
import { CameraScreen } from 'src/screens/app/CameraScreen';
import { useCurrentUser } from '../contexts/AuthProvider';

export type AppStackParamList = {
  Profile: { image: string };
  Camera: undefined;
};

export type AppNavProps<T extends keyof AppStackParamList> = NativeStackNavigationProp<AppStackParamList, T>;

const Tab = createBottomTabNavigator<AppStackParamList>();

export const AppNavigator: FC = (): JSX.Element => {
  const user = useCurrentUser();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({}) => <Camera />,
          tabBarStyle: { display: 'none' },
        }}
      />
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
