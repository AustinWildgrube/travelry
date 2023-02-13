import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';

import { FeedScreen } from '&/screens/app/FeedScreen';

export type FeedStackParamList = {
  Feed: undefined;
};

export type FeedNavProps<T extends keyof FeedStackParamList> = NativeStackNavigationProp<FeedStackParamList, T>;

const Stack = createNativeStackNavigator<FeedStackParamList>();
export function FeedNavigator(): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Feed" component={FeedScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
