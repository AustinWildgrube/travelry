import { supabase } from '&/services/supabase-client';

export type AccountStats = {
  following_count: number;
  followers_count: number;
  trip_count: number;
};

export type UserProfile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string | undefined;
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
    .eq('id', id);

  if (error) {
    throw new Error(`Error ${error.code}: ${error.message}`);
  }

  return data[0];
};

export const isFollowingUser = async (id: string, targetId: string): Promise<string> => {
  const { data, error } = await supabase
    .from('follow')
    .select('id')
    .eq('account_id', id)
    .eq('target_account_id', targetId);

  if (error) {
    throw new Error(`Error ${error.code}: ${error.message}`);
  }

  return data[0];
};

export const followUser = async (id: string, targetId: string): Promise<void> => {
  let { error } = await supabase.from('follow').insert({ account_id: id, target_account_id: targetId });

  if (error) {
    throw new Error(`Error ${error.code}: ${error.message}`);
  }
};

export const unfollowUser = async (id: string, targetId: string): Promise<void> => {
  let { error } = await supabase.from('follow').delete().eq('account_id', id).eq('target_account_id', targetId);

  if (error) {
    throw new Error(`Error ${error.code}: ${error.message}`);
  }
};
