import { supabase } from '&/services/supabase-client';

export const downloadSupabaseMedia = (bucket: 'avatars' | 'posts', path: string): string => {
  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    if (data) {
      return data.publicURL;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.message);
    }
  }

  return '';
};
