import { type UserProfile } from '&/queries/users';
import { supabase } from '&/services/supabase-client';

export type PostMedia = {
  id: string;
  file_url: string;
};

export type PostStat = {
  id: string;
  likes_count: string;
};

export type Post = {
  id: string;
  caption: string;
  created_at: string;
  location: string;
  account: Pick<UserProfile, 'id' | 'full_name' | 'avatar_url'>;
  post_media: PostMedia[];
  post_stat: PostStat;
};

// TODO: Change album id
export const createPost = async (accountId: string, caption: string, location: string): Promise<string> => {
  const { data, error } = await supabase
    .from('post')
    .insert([
      {
        account_id: accountId,
        caption: caption.trim(),
        location: location.trim(),
        album_id: '78d5eecd-0651-4554-92b4-baa2fe9467e7',
      },
    ])
    .select('id')
    .single();

  if (error) {
    throw new Error(`${error.code}: createPost: ${error.message}`);
  }

  return data.id;
};

export const createPostMedia = async (accountId: string, postId: string, image: string): Promise<void> => {
  const filePath = `${Math.random()}.jpg`;

  const { error } = await supabase.storage.from('posts').upload(filePath, {
    uri: image,
    name: 'photo.jpg',
    type: 'jpg',
  });

  if (error) {
    throw new Error(`${error.name}: createPostMedia: ${error.message}`);
  }

  const { error: errorTwo } = await supabase
    .from('post_media')
    .insert([{ account_id: accountId, post_id: postId, file_url: filePath }]);

  if (errorTwo) {
    throw new Error(`${errorTwo.code}: createPostMedia: ${errorTwo.message}`);
  }
};

export const getPostById = async (id: string): Promise<Post> => {
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
          full_name,
          avatar_url
        ),
        post_media (
          id,
          file_url
        ),
        post_stat (
          id,
          likes_count
        )
      `,
    )
    .eq('id', id)
    .single();

  if (error) {
    console.log(error);
    throw new Error(`${error.code}: getPostById: ${error.message}`);
  }

  return data as Post;
};

// TODO: Only need ID from account so maybe change Post type?
export const getPostsByAlbumId = async (id: string): Promise<Post[]> => {
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
          full_name,
          avatar_url
        ),
        post_media (
          id,
          file_url
        )
      `,
    )
    .eq('album_id', id);

  if (error) {
    throw new Error(`${error.code}: getPostsByAlbumId: ${error.message}`);
  }

  return data as Post[];
};

export const getAllPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.from('post').select(
    `
      id,
      caption,
      created_at,
      location,
      account (
        id,
        full_name,
        avatar_url
      ),
      post_media (
        id,
        file_url
      ),
      post_stat (
        id,
        likes_count
      )
    `,
  );

  if (error) {
    throw new Error(`${error.code}: getAllPosts: ${error.message}`);
  }

  return data as Post[];
};

// TODO: use if create post is unsuccessful
export const deletePostById = async (postId: string): Promise<void> => {
  const { error } = await supabase.from('post').delete().eq('id', postId);

  if (error) {
    throw new Error(`${error.code}: deletePostById: ${error.message}`);
  }
};
