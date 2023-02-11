import { useEffect, useState } from 'react';

import { Avatar, Button, H1, Separator, Text, XStack, YStack } from 'tamagui';

import { useAuth } from '&/contexts/AuthProvider';
import { type UserProfile } from '&/queries/users';
import { downloadSupabaseMedia } from '&/utilities/helpers';

interface HeaderProps {
  user: UserProfile;
}

export function Header({ user }: HeaderProps): JSX.Element {
  const { logout } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (user.avatar_url) {
      setAvatarUrl(downloadSupabaseMedia('avatars', user.avatar_url));
    }
  }, [user]);

  return (
    <YStack mt="$4" mb="$4">
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

      <Button onPress={logout} size="$2" mt="$2" p={0} chromeless>
        Edit Profile
      </Button>

      <XStack jc="space-around" mt="$4" mb="$6">
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

      <Separator />
    </YStack>
  );
}
