import { supabase } from '&/services/supabase';
import { type Comment, type PaginatedData } from '&/types/types';
import { COMMENTS_PER_PAGE, REPLIES_PER_PAGE } from '&/utils/constants';

export const createComment = async (
  accountId: string,
  postId: string,
  text: string,
  reply?: boolean,
  inReplyToCommentId?: number,
  replyOriginCommentId?: number,
): Promise<Comment> => {
  const { data: comment, error } = await supabase
    .from('comment')
    .insert([
      {
        account_id: accountId,
        post_id: postId,
        text: text,
        reply: reply,
        in_reply_to_comment_id: inReplyToCommentId,
        reply_origin_comment_id: replyOriginCommentId,
      },
    ])
    .select(
      `
        id,
        text,
        post_id,
        account (
          id,
          first_name,
          last_name,
          avatar_url,
          avatar_placeholder
        ),
        comment_like (
          id,
          comment_id,
          account_id
        ),
        reply_origin_comment_id,
        in_reply_to_comment_id (
          id,
          account (
            id,
            first_name,
            last_name
          )
        )
      `,
    )
    .single();

  // There is an issue where the trigger hasn't happened yet,
  // so we need to manually add the comment_stat
  if (comment) {
    // @ts-ignore - we know it doesn't exist
    comment.comment_stat = {
      id: comment.id,
      likes_count: 0,
      replies_count: 0,
    };
  }

  if (error) {
    throw new Error(`createComment(${error.code}): ${error.message}`);
  }

  return comment as unknown as Comment;
};

export const getCommentsByPostId = async (page: number, userId: string, postId: string): Promise<PaginatedData<Comment>> => {
  const {
    data: comments,
    count,
    error,
  } = await supabase
    .from('comment')
    .select(
      `
        id,
        text,
        post_id,
        account (
          id,
          username,
          first_name,
          last_name,
          avatar_url,
          avatar_placeholder
        ),
        comment_stat (
          id,
          likes_count,
          replies_count
        ),
        comment_like (
          id,
          comment_id,
          account_id
        ),
        reply_origin_comment_id,
        in_reply_to_comment_id (
          id,
          account (
            id,
            first_name,
            last_name
          )
        )
      `,
      {
        count: 'exact',
      },
    )
    .range(0, page * COMMENTS_PER_PAGE - 1)
    .eq('comment_like.account_id', userId)
    .eq('post_id', postId)
    .eq('reply', false)
    .order('id', { ascending: false });

  if (error) {
    throw new Error(`getCommentsByPostId(${error.code}): ${error.message}`);
  }

  return {
    data: comments as Comment[],
    count: count || 0,
    cursor: page,
  };
};

export const getRepliesByCommentId = async (page: number, currentUserId: string, commentId: number): Promise<PaginatedData<Comment>> => {
  const {
    data: replies,
    count,
    error,
  } = await supabase
    .from('comment')
    .select(
      `
        id,
        text,
        post_id,
        account (
          id,
          first_name,
          last_name,
          avatar_url,
          avatar_placeholder
        ),
        comment_stat (
          id,
          likes_count,
          replies_count
        ),
        comment_like (
          id,
          comment_id,
          account_id
        ),
        reply_origin_comment_id,
        in_reply_to_comment_id (
          id,
          account (
            id,
            first_name,
            last_name
          )
        )
     `,
      {
        count: 'exact',
      },
    )
    .range(0, page * REPLIES_PER_PAGE - 1)
    .eq('comment_like.account_id', currentUserId)
    .eq('reply_origin_comment_id', commentId)
    .order('id', { ascending: true });

  if (error) {
    throw new Error(`getRepliesByCommentId(${error.code}): ${error.message}`);
  }

  return {
    data: replies as Comment[],
    count: count || 0,
    cursor: page,
  };
};

export const deleteCommentById = async (commentId: number): Promise<void> => {
  const { error } = await supabase.from('comment').delete().eq('id', commentId);

  if (error) {
    throw new Error(`${error.code}: deleteCommentById: ${error.message}`);
  }
};
