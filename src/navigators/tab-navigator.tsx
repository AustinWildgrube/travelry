import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Camera, Home, User } from '@tamagui/lucide-icons';

import { useCurrentUser } from '&/contexts/AuthProvider';
import { FeedNavigator } from '&/navigators/feed-navigator';
import { ProfileNavigator } from '&/navigators/profile-navigator';
import { CameraScreen } from '&/screens/app/CameraScreen';
import { useUserStore } from '&/stores/user';

export type TabStackParamList = {
  HomeTab: undefined;
  CameraTab: undefined;
  ProfileTab: undefined;
};

export type TabNavProps<T extends keyof TabStackParamList> = NativeStackNavigationProp<TabStackParamList, T>;

const Tab = createBottomTabNavigator<TabStackParamList>();
export function TabNavigator(): JSX.Element {
  const user = useCurrentUser();
  const setViewedUser = useUserStore(state => state.setViewedUser);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        component={FeedNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({}) => <Home />,
          title: 'Home',
        }}
      />
      <Tab.Screen
        name="CameraTab"
        component={CameraScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Camera',
          tabBarIcon: ({}) => <Camera />,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        listeners={{
          tabPress: e => {
            setViewedUser(user);
          },
        }}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({}) => <User />,
        }}
      />
    </Tab.Navigator>
  );
}
