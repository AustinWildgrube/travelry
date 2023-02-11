import { UserProfile } from '&/queries/users';
import { supabase } from '&/services/supabase-client';

export type PostMedia = {
  id: string;
  file_url: string;
};

export type Post = {
  caption: string;
  created_at: string;
  location: string;
  post_media: PostMedia[];
  account: UserProfile;
};

// TODO: Change album id
export const createPost = async (accountId: string, caption: string, location: string): Promise<string> => {
  const { data, error } = await supabase.from('post').insert([
    {
      account_id: accountId,
      caption: caption.trim(),
      location: location.trim(),
    },
  ]);

  if (error) {
    throw new Error(`Error: ${error.code}: ${error.message}`);
  }

  if (data) {
    return data[0].id;
  }

  return '';
};

export const createPostMedia = async (accountId: string, postId: string, image: string): Promise<void> => {
  const filePath = `${Math.random()}.jpg`;

  const { error } = await supabase.storage.from('posts').upload(filePath, {
    uri: image,
    name: 'photo.jpg',
    type: 'jpg',
  });

  if (error) {
    throw new Error(`Error: ${error.name}: ${error.message}`);
  }

  const { error: errorTwo } = await supabase
    .from('post_media')
    .insert([
      { account_id: accountId, post_id: postId, file_url: filePath, album_id: '78d5eecd-0651-4554-92b4-baa2fe9467e7' },
    ]);

  if (errorTwo) {
    throw new Error(`Error: ${errorTwo.code}: ${errorTwo.message}`);
  }
};

export const getPostsByAccountId = async (id: string): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('post')
    .select(
      `
          caption,
          created_at,
          location,
          post_media (
            id,
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
      )
    `,
  );

  console.log(error);
  if (error) {
    throw new Error(`Error: ${error.code}: ${error.message}`);
  }

  return data;
};

// TODO: use if create post is unsuccessful
export const deletePostById = async (postId: string): Promise<void> => {
  const { error } = await supabase.from('post').delete().eq('id', postId);

  if (error) {
    throw new Error(`Error: ${error.code}: ${error.message}`);
  }
};
