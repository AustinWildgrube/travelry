import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';

import { TabNavigator } from '&/navigators/tab-navigator';
import { type Post } from '&/queries/posts';
import { type UserProfile } from '&/queries/users';
import { EditScreen } from '&/screens/app/EditScreen';
import { PostScreen } from '&/screens/app/PostScreen';

export type AppStackParamList = {
  Tabs: any;
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
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Post" component={PostScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Edit" component={EditScreen} />
    </Stack.Navigator>
  );
}
