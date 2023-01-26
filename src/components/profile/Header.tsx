import { useEffect, useState } from 'react';

import { Avatar, Button, H1, Paragraph, Text, XStack, YStack } from 'tamagui';

import { useAuth, useCurrentUser } from '../../contexts/AuthProvider';
import { supabase } from '../../services/supabaseClient';

export function Header(): JSX.Element {
  const user = useCurrentUser();
  const { logout } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  const downloadImage = async (path: string): Promise<void> => {
    try {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      setAvatarUrl(data?.publicURL);
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message);
      }
    }
  };

  useEffect(() => {
    if (user.avatar_url) {
      downloadImage(user.avatar_url);
    }
  }, [user]);

  return (
    <>
      <Paragraph als="center" mt="$2">
        @{user.username}
      </Paragraph>

      <YStack mt="$6">
        <Avatar size="$10" als="center" circular>
          <Avatar.Image src={avatarUrl} accessibilityLabel={`${user.full_name}'s profile image`} />
          <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
        </Avatar>

        <H1 size="$8" als="center" mt="$4">
          {user.full_name}
        </H1>

        <Text ta="center" mt="$2">
          {user.bio}
        </Text>

        <Button onPress={logout} size="$2" mt="$2" chromeless>
            Edit Profile
        </Button>

        <XStack jc="space-around" mt="$4">
          <YStack>
            <Text>Posts</Text>
            <Text ta="center" mt="$2">
              {user.account_stat.trip_count}
            </Text>
          </YStack>

          <YStack>
            <Text>Followers</Text>
            <Text ta="center" mt="$2">
              {user.account_stat.followers_count}
            </Text>
          </YStack>

          <YStack>
            <Text>Following</Text>
            <Text ta="center" mt="$2">
              {user.account_stat.following_count}
            </Text>
          </YStack>
        </XStack>
      </YStack>
    </>
  );
}
