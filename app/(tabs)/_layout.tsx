import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

// import { useCurrentUser } from '&/contexts/AuthProvider';

export default function TabsLayout(): JSX.Element | null {
  // TODO: find out if context can be used in a layout
  // const user = useCurrentUser();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1565c0',
        tabBarInactiveTintColor: '#343a40',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="camera/index"
        options={{
          tabBarLabel: 'Camera',
          tabBarIcon: ({ color }) => <Feather name="camera" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile/[userId]"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
          href: `profile/94fd21e7-8592-4fc5-88d4-f32b55f672ae`,
          // href: `profile/${user.id}`,
        }}
      />

      {/* hidden tabs */}
      <Tabs.Screen
        name="profile/album/[albumId]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/follows"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
