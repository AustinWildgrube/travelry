import { FC } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import { Camera, User } from '@tamagui/lucide-icons';

import { useCurrentUser } from '&/contexts/AuthProvider';
import type { Post } from '&/queries/posts';
import type { UserProfile } from '&/queries/users';
import { CameraScreen } from '&/screens/app/CameraScreen';
import { PostScreen } from '&/screens/app/PostScreen';
import { ProfileScreen } from '&/screens/app/ProfileScreen';

export type AppStackParamList = {
  Tab: undefined;
  Post: {
    account: UserProfile;
    post: Post;
    startIndex: number;
  };
  Camera: undefined;
  Profile: {
    image: string;
  };
};

export type AppNavProps<T extends keyof AppStackParamList> = NativeStackNavigationProp<AppStackParamList, T>;

const Stack = createNativeStackNavigator<AppStackParamList>();
export const RootNavigator: FC = (): JSX.Element => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tab" component={AppNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Post" component={PostScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

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
