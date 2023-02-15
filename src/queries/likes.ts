import { supabase } from '&/services/supabase-client';

export type Like = {
  id: string;
  post_id: string;
};

export const getLikesByAccountId = async (id: string): Promise<Like[]> => {
  const { data, error } = await supabase
    .from('like')
    .select(
      `
          id,
          post_id
          )
        `,
    )
    .eq('account_id', id);

  if (error) {
    throw new Error(`Error: ${error.code}: ${error.message}`);
  }

  return data;
};
