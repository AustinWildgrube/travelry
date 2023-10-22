import { supabase } from '&/services/supabase';

export const likePost = async (accountId: string, postId: string): Promise<void> => {
  const { error } = await supabase.from('post_like').insert([
    {
      account_id: accountId,
      post_id: postId,
    },
  ]);

  if (error) {
    throw new Error(`likePost(${error.code}): ${error.message}`);
  }
};

export const unlikePost = async (accountId: string, postId: string): Promise<void> => {
  let { error } = await supabase.from('post_like').delete().eq('account_id', accountId).eq('post_id', postId);

  if (error) {
    throw new Error(`unlikePost(${error.code}): ${error.message}`);
  }
};

export const likeComment = async (accountId: string, commentId: number): Promise<void> => {
  const { error } = await supabase.from('comment_like').insert([
    {
      account_id: accountId,
      comment_id: commentId,
    },
  ]);

  if (error) {
    throw new Error(`likeComment(${error.code}): ${error.message}`);
  }
};

export const unlikeComment = async (accountId: string, commentId: number): Promise<void> => {
  let { error } = await supabase.from('comment_like').delete().eq('account_id', accountId).eq('comment_id', commentId);

  if (error) {
    throw new Error(`unlikeComment(${error.code}): ${error.message}`);
  }
};
