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

export const likePost = async (accountId: string, postId: string): Promise<void> => {
  const { error } = await supabase.from('like').insert([
    {
      account_id: accountId,
      post_id: postId,
    },
  ]);

  if (error) {
    throw new Error(`Error: ${error.code}: ${error.message}`);
  }
};

export const unlikePost = async (accountId: string, postId: string): Promise<void> => {
  let { error } = await supabase.from('like').delete().eq('account_id', accountId).eq('post_id', postId);

  if (error) {
    throw new Error(`Error: ${error.code}: ${error.message}`);
  }
};
