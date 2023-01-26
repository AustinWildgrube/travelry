import { Alert } from 'react-native';
import { supabase } from 'src/services/supabaseClient';

export type AccountStats = {
  following_count: number;
  followers_count: number;
  trip_count: number;
};

export type UserProfile = {
  id: string;
  username: string;
  full_name: string | undefined;
  avatar_url: string | undefined;
  bio: string | undefined;
  account_stat: AccountStats;
};

export const getUserProfile = async (id: string) => {
  try {
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

    if (data !== null) {
      return data[0] as UserProfile;
    }
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert('An error occurred', error.message);
    }

    console.error(error);
  }

  return null;
};
