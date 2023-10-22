import { supabase } from '&/services/supabase';
import { type AlbumPostMedia, type PaginatedData, type Post } from '&/types/types';
import { POSTS_PER_PAGE } from '&/utils/constants';

export const getFeedPosts = async (page: number, account_id: string): Promise<PaginatedData<Post>> => {
  const { data, count, error } = await supabase
    .from('post')
    .select(
      `
        id,
        caption,
        created_at,
        location,
        account (
          id,
          username,
          first_name,
          last_name,
          avatar_url,
          avatar_placeholder
        ),
        post_media (
          id,
          file_url,
          file_placeholder
        ),
        post_stat (
          id,
          likes_count
        ),
        post_like (
           id, 
           post_id,
           account_id
        )
      `,
      {
        count: 'exact',
      },
    )
    .eq('post_like.account_id', account_id)
    .range((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE - 1);

  if (error) {
    throw new Error(`getAllPosts(${error.code}): ${error.message}`);
  }

  return {
    data: data as Post[],
    count: count || 0,
    cursor: page,
  };
};

export const getPostById = async (id: string | string[] | undefined, account_id: string | undefined): Promise<Post> => {
  const { data, error } = await supabase
    .from('post')
    .select(
      `
        id,
        caption,
        created_at,
        location,
        account (
          id,
          username,
          first_name,
          last_name,
          avatar_url,
          avatar_placeholder
        ),
        post_media (
          id,
          file_url,
          file_placeholder
        ),
        post_stat (
          id,
          likes_count
        ),
        post_like (
           id, 
           post_id,
           account_id
        )
      `,
    )
    .eq('post_like.account_id', account_id)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`getPostById(${error.code}): ${error.message}`);
  }

  return data as Post;
};

export const getPostMediaByAlbumId = async (id: string): Promise<AlbumPostMedia[]> => {
  const { data, error } = await supabase
    .from('post')
    .select(
      `
      id,
      album_id,
      post_media (
        id,
        file_url,
        file_placeholder
      )
    `,
    )
    .eq('album_id', id);

  if (error) {
    throw new Error(`getPostMediaByAlbumId(${error.code}): ${error.message}`);
  }

  return data as AlbumPostMedia[];
};

export const deletePostById = async (id: string): Promise<void> => {
  const { error } = await supabase.from('post').delete().eq('id', id);

  if (error) {
    throw new Error(`deletePostById(${error.code}): ${error.message}`);
  }
};
