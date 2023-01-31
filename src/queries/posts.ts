import { Alert } from 'react-native';

import { supabase } from '&/services/supabase-client';

export type PostMedia = {
  id: string;
  file_url: string;
};

export type Post = {
  caption: string;
  location: string;
  post_media: PostMedia[];
};

export const getPosts = async (id: string): Promise<Post[] | null> => {
  try {
    const { data, error } = await supabase
      .from('post')
      .select(
        `
          caption,
          created_at,
          location,
          post_media (
            id,
            file_url
          )
        `,
      )
      .eq('account_id', id);

    if (error) {
      throw new Error(`Error ${error.code}: ${error.message}`);
    }

    if (data !== null) {
      return data;
    }
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert('An error occurred', error.message);
    }

    console.error(error);
  }

  return null;
};
