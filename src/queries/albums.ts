import { supabase } from '&/services/supabase-client';

export type Album = {
  id: string;
  name: string;
  cover: {
    file_url: string;
  };
};

export const getAlbumsByAccountId = async (id: string): Promise<Album[]> => {
  const { data, error } = await supabase
    .from('album')
    .select(
      `
        id,
        name,
        cover (
          file_url
        )
      `,
    )
    .eq('account_id', id);

  if (error) {
    throw new Error(`Error: ${error.code}: ${error.message}`);
  }

  return data;
};
