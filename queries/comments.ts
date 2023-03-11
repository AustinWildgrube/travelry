import { supabase } from '&/services/supabase-client';

import { UserProfile } from './users';

export type Comment = {
  id: string;
  text: string;
  account: Pick<UserProfile, 'id' | 'full_name' | 'avatar_url'>;
};

export const createComment = async (
  accountId: string,
  postId: string,
  text: string,
  reply?: boolean,
  inReplyToCommentId?: string,
): Promise<Comment> => {
  const { data, error } = await supabase
    .from('comment')
    .insert([
      {
        account_id: accountId,
        post_id: postId,
        text: text,
        reply: reply,
        in_reply_to_comment_id: inReplyToCommentId,
      },
    ])
    .select(
      `
        id,
        text,
        account (
          id,
          full_name,
          avatar_url
        )
      `,
    )
    .single();

  if (error) {
    throw new Error(`${error.code}: createComment: ${error.message}`);
  }

  return data as Comment;
};

export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comment')
    .select(
      `
        id,
        text,
        account (
          id,
          full_name,
          avatar_url
        )
      `,
    )
    .eq('post_id', postId)
    .order('id', { ascending: false });

  if (error) {
    throw new Error(`${error.code}: getCommentsByPostId: ${error.message}`);
  }

  return data as Comment[];
};
