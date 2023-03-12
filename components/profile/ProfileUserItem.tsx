import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Link } from 'expo-router';

import { Avatar } from '&/components/atoms';
import { UserProfileSlim } from '&/queries/users';
import { downloadSupabaseMedia } from '&/utilities/helpers';

import { ProfileFollowButton } from './ProfileFollowButton';

interface UserItemProps {
  id: string;
  account: UserProfileSlim;
}

export function ProfileUserItem({ id, account }: UserItemProps): JSX.Element {
  return (
    <View style={styles.itemContainer}>
      <Link href={`/profile/${account.id}`} key={id} asChild>
        <Pressable style={styles.item}>
          <Avatar src={downloadSupabaseMedia('avatars', account.avatar_url)} size={48} style={styles.accountAvatar} />

          <View>
            <Text style={styles.accountName}>{account.full_name}</Text>
            <Text style={styles.location}>@{account.username}</Text>
          </View>
        </Pressable>
      </Link>

      <ProfileFollowButton viewedUserId={account.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 21,
    marginHorizontal: 16,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  accountAvatar: {
    marginRight: 8,
  },
  accountName: {
    color: '#0C0F14',
    fontSize: 14,
    fontWeight: '600',
  },
  location: {
    color: '#7C8089',
  },
});
