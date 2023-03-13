import { supabase } from '&/services/supabase-client';

export type AccountStats = {
  following_count: number;
  followers_count: number;
  trip_count: number;
};

export type UserFollowers = {
  id: string;
  account: UserProfileSlim;
};

export type UserProfileSlim = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
};

export type UserProfile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string | null;
  account_stat: AccountStats;
};

export const getUserProfile = async (id: string): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('account')
    .select(
      `
        id,
        username, 
        full_name,
        avatar_url, 
        bio,
        account_stat (
          following_count, 
          followers_count, 
          trip_count
        )
      `,
    )
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`${error.code}: getUserProfile: ${error.message}`);
  }

  return data as UserProfile;
};

export const getUserFromSearch = async (search: string): Promise<UserProfileSlim[]> => {
  const { data, error } = await supabase
    .from('account')
    .select(
      `
        id,
        username,
        full_name,
        avatar_url
    `,
    )
    .ilike('full_name', `${search}%`)
    .ilike('username', `${search}%`);

  if (error) {
    throw new Error(`${error.code}: getUserFromSearch: ${error.message}`);
  }

  return data as UserProfileSlim[];
};

export const getUserFollowers = async (id: string): Promise<UserFollowers[]> => {
  const { data, error } = await supabase
    .from('follow')
    .select(
      `
        id,
        account!account_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `,
    )
    .eq('target_account_id', id);

  if (error) {
    throw new Error(`${error.code}: getUserFollowers: ${error.message}`);
  }

  return data as UserFollowers[];
};

export const getUserFollowing = async (id: string): Promise<UserFollowers[]> => {
  const { data, error } = await supabase
    .from('follow')
    .select(
      `
        id,
        account!target_account_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `,
    )
    .eq('account_id', id);

  if (error) {
    throw new Error(`${error.code}: getUserFollowing: ${error.message}`);
  }

  return data as UserFollowers[];
};

export const isFollowingUser = async (id: string, targetId: string): Promise<number | null> => {
  const { count, error } = await supabase
    .from('follow')
    .select('id', { count: 'exact', head: true })
    .eq('account_id', id)
    .eq('target_account_id', targetId);

  if (error) {
    throw new Error(`${error.code}: isFollowingUser: ${error.message}`);
  }

  return count;
};

export const followUser = async (id: string, targetId: string): Promise<void> => {
  let { error } = await supabase.from('follow').insert({ account_id: id, target_account_id: targetId });

  if (error) {
    throw new Error(`${error.code}: followUser: ${error.message}`);
  }
};

export const unfollowUser = async (id: string, targetId: string): Promise<void> => {
  let { error } = await supabase.from('follow').delete().eq('account_id', id).eq('target_account_id', targetId);

  if (error) {
    throw new Error(`${error.code}: unfollowUser: ${error.message}`);
  }
};
