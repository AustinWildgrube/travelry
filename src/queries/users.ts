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
