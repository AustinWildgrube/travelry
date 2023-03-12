import { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { Stack, useSearchParams } from 'expo-router';
import { TabBar, TabView } from 'react-native-tab-view';
import { type Route } from 'react-native-tab-view/src/types';

import { ProfileFollowers, ProfileFollowing } from '&/components/profile';
import { FollowsTarget } from '&/types/global';

export default function Follows(): JSX.Element {
  const { fullName, id, target }: Partial<{ fullName: string; id: string; target: FollowsTarget }> = useSearchParams();
  const width = Dimensions.get('window').width;

  if (!fullName || !id || !target) {
    return <Text>Error</Text>;
  }

  const [index, setIndex] = useState<FollowsTarget>(+target);
  const [routes] = useState([
    { key: 'followers', title: 'Followers' },
    { key: 'following', title: 'Following' },
  ]);

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'followers':
        return <ProfileFollowers userName={fullName} userId={id} />;
      case 'following':
        return <ProfileFollowing userName={fullName} userId={id} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props: any) => (
    <TabBar
      renderLabel={({ route }) => <Text style={{ color: 'black' }}>{route.title}</Text>}
      indicatorStyle={{ backgroundColor: 'black' }}
      style={{ backgroundColor: 'white' }}
      {...props}
    />
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: width }}
        renderScene={renderScene}
        lazy
      />

      <Stack.Screen
        options={{
          headerTitle: fullName,
          headerBackVisible: true,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
});
