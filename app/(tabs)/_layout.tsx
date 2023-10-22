import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useUserStore } from '&/stores/user';

export default function TabsLayout(): JSX.Element | null {
  const user = useUserStore(state => state.user);
  if (!user) return null;

  // todo: theme
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0369a1',
        tabBarInactiveTintColor: '#343a40',
        tabBarStyle: {
          backgroundColor: '#fff',
        },
      }}>
      <Tabs.Screen
        name="feed"
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color }: { color: string }) => <Feather name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="conversations"
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color }: { color: string }) => <Feather name="mail" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="[userId]"
        options={{
          href: `/${user.id}`,
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }: { color: string }) => <Feather name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
