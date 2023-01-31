import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Feather } from '@expo/vector-icons';

import { downloadSupabaseMedia } from '../../utilities/helpers';
import type { UserProfile } from '../../queries/users';

interface ActionsProps {
  account: UserProfile;
}

export function PostActions({ account }: ActionsProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: downloadSupabaseMedia('avatars', account.avatar_url),
        }}
        style={styles.avatarImage}
      />

      <View style={styles.actions}>
        <Pressable style={styles.actionButton}>
          <Feather name="map-pin" size={21} color="black" />
        </Pressable>

        <Pressable style={styles.actionButton}>
          <Feather name="heart" size={21} color="black" />
        </Pressable>

        <Pressable style={styles.actionButton}>
          <Feather name="share" size={21} color="black" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  avatarImage: {
    borderColor: '#fff',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 50,
    height: 92,
    marginTop: -46,
    width: 92,
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 64,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    height: 44,
    justifyContent: 'center',
    marginTop: -22,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.15,
    shadowColor: '#102344',
    width: 44,
  },
});
