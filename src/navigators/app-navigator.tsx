import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import { Camera, Home, User } from '@tamagui/lucide-icons';

import { FollowButton } from '&/components/profile/FollowButton';
import { useCurrentUser } from '&/contexts/AuthProvider';
import { type Post } from '&/queries/posts';
import { type UserProfile } from '&/queries/users';
import { CameraScreen } from '&/screens/app/CameraScreen';
import { EditScreen } from '&/screens/app/EditScreen';
import { FeedScreen } from '&/screens/app/FeedScreen';
import { PostScreen } from '&/screens/app/PostScreen';
import { ProfileScreen } from '&/screens/app/ProfileScreen';
import { useUserStore } from '&/stores/user-store';

export type AppStackParamList = {
  Tab: undefined;
  Camera: undefined;
  Feed: undefined;
  Profile: undefined;
  Edit: {
    image: string;
  };
  Post: {
    account: UserProfile;
    post: Post;
    startIndex: number;
  };
};

export type AppNavProps<T extends keyof AppStackParamList> = NativeStackNavigationProp<AppStackParamList, T>;

const Stack = createNativeStackNavigator<AppStackParamList>();
export function RootNavigator(): JSX.Element {
  return (
    <Stack.Navigator initialRouteName="Feed">
      <Stack.Screen name="Tab" component={AppNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Post" component={PostScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Edit" component={EditScreen} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator<AppStackParamList>();
export function AppNavigator(): JSX.Element {
  const user = useCurrentUser();
  const viewedUser = useUserStore(state => state.viewedUser);
  const setViewedUser = useUserStore(state => state.setViewedUser);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({}) => <Home />,
        }}
      />
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
        listeners={{
          tabPress: e => {
            setViewedUser(user);
          },
        }}
        options={{
          headerShown: true,
          headerRight: () => <FollowButton loggedInUser={user} viewedUser={viewedUser} />,
          title: `@${viewedUser.username}`,
          tabBarLabel: 'Profile',
          tabBarIcon: ({}) => <User />,
        }}
      />
    </Tab.Navigator>
  );
}
