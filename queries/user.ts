import { Alert } from 'react-native';

import { decode } from 'base64-arraybuffer';
import { CryptoDigestAlgorithm, digestStringAsync } from 'expo-crypto';
import { type ImageResult } from 'expo-image-manipulator';

import { createAvatarsSignedUploadUrl } from '&/queries/signature';
import { supabase } from '&/services/supabase';
import { type User, type UserFollows, type UserSummary } from '&/types/types';

export const getUserAccount = async (id: string, currentUserId: string): Promise<User> => {
  // TODO: change cover photo to be anything not just a post media
  // TODO: allow for post_count to increment
  const { data, error } = await supabase
    .from('account')
    .select(
      `
      id,
      username, 
      first_name,
      last_name,
      avatar_url,
      avatar_placeholder,
      bio,
      account_stat (
        following_count, 
        followers_count, 
        trip_count
      ),
      album (
        id,
        name,
        cover,
        cover_placeholder,
        post_count
      ),
      is_following:follow!target_account_id(count)
    `,
    )
    .eq('id', id)
    .eq('follow.account_id', currentUserId)
    .eq('follow.target_account_id', id)
    .order('name', { foreignTable: 'album', ascending: true })
    .single();

  if (error) throw new Error(`getUser(${error.code}): ${error.message}`);

  // transform is_following from [{ count: 0 }] to boolean
  const user = data as User;
  const userCount = user.is_following as { count: number }[];
  user.is_following = userCount[0].count > 0;

  console.log(user);

  return user;
};

export const getUserAccountSearch = async (searchText: string): Promise<UserSummary[]> => {
  const { data: conversationRecipients, error } = await supabase
    .from('account')
    .select(
      `
      id,
      username,
      first_name,
      last_name,
      avatar_url,
      avatar_placeholder
    `,
    )
    .or(`username.ilike.%${searchText}%,first_name.ilike.%${searchText}%,last_name.ilike.%${searchText}%`);

  if (error) throw new Error(`getUserAccountSearch(${error.code}): ${error.message}`);

  return conversationRecipients as UserSummary[];
};

export const updateUserAccount = async (id: string, updates: Partial<User>): Promise<void> => {
  const { error } = await supabase.from('account').update(updates).eq('id', id);
  if (error) throw new Error(`updateUserAccount(${error.code}): ${error.message}`);
};

export const uploadUserAvatar = async (userId: string, avatarImage: ImageResult): Promise<void> => {
  if (!avatarImage.base64) return;

  const hash = await digestStringAsync(CryptoDigestAlgorithm.SHA256, avatarImage.uri);
  const filename = `${hash}.jpg`;

  const signedUrl = await createAvatarsSignedUploadUrl(filename);
  const { error } = await supabase.storage.from('avatars').uploadToSignedUrl(filename, signedUrl, decode(avatarImage.base64), {
    upsert: true,
    contentType: 'image/jpeg',
  });

  if (error) {
    if (error.statusCode === 413) Alert.alert('Image is too large', 'Please select an image under 2MB.');
    throw new Error(`uploadUserAvatarOne(${error.statusCode}): ${error.message}`);
  }

  const { error: errorTwo } = await supabase.from('account').update({ avatar_url: filename }).eq('id', userId);
  if (errorTwo) throw new Error(`uploadUserAvatarTwo(${errorTwo.code}): ${errorTwo.message}`);
};

export const followUser = async (id: string, targetId: string): Promise<void> => {
  let { error } = await supabase.from('follow').insert({ account_id: id, target_account_id: targetId });
  if (error) throw new Error(`followUser(${error.code}): ${error.message}`);
};

export const unfollowUser = async (id: string, targetId: string): Promise<void> => {
  let { error } = await supabase.from('follow').delete().eq('account_id', id).eq('target_account_id', targetId);
  if (error) throw new Error(`unfollowUser(${error.code}): ${error.message}`);
};

export const getUserFollowers = async (id: string): Promise<UserFollows[]> => {
  const { data, error } = await supabase
    .from('follow')
    .select(
      `
        id,
        account!account_id (
          id,
          username,
          first_name,
          last_name,
          avatar_url,
          avatar_placeholder
        ),
        is_following:account!target_account_id(count)
      `,
    )
    .eq('target_account_id', id);

  if (error) throw new Error(`getUserFollowers(${error.code}): ${error.message}`);

  // transform is_following from [{ count: 0 }] to boolean
  const followers = data as UserFollows[];
  for (let i = 0; i < followers.length; i++) {
    if (!followers[i].is_following) {
      followers[i].is_following = false;
    } else {
      // @ts-ignore
      followers[i].is_following = followers[i].is_following.count > 0;
    }
  }

  return followers as UserFollows[];
};

export const getUserFollowing = async (id: string): Promise<UserFollows[]> => {
  const { data, error } = await supabase
    .from('follow')
    .select(
      `
        id,
        account!target_account_id (
          id,
          username,
          first_name,
          last_name,
          avatar_url,
          avatar_placeholder
        ),
        is_following:account!target_account_id(count)
      `,
    )
    .eq('account_id', id);

  if (error) throw new Error(`getUserFollowing(${error.code}): ${error.message}`);

  // transform is_following from [{ count: 0 }] to boolean
  const followers = data as UserFollows[];
  for (let i = 0; i < followers.length; i++) {
    if (!followers[i].is_following) {
      followers[i].is_following = false;
    } else {
      // @ts-ignore
      followers[i].is_following = followers[i].is_following.count > 0;
    }
  }

  return data as UserFollows[];
};
