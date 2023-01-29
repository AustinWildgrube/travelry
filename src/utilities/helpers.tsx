import { supabase } from 'src/services/supabaseClient';

export const downloadSupabaseMedia = (bucket: string, path: string): string => {
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
