import { supabase } from '&/services/supabase';

export const createAvatarsSignedUploadUrl = async (path: string): Promise<string> => {
  const { data, error } = await supabase.storage.from('avatars').createSignedUploadUrl(path);

  if (error) {
    throw new Error(`createAvatarsSignedUrl(${error.stack}): ${error.message}`);
  }

  return data.token;
};

export const getSignedStorageUrl = async (bucket: 'avatars' | 'posts', path: string): Promise<string> => {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60);

  if (error) {
    throw new Error(`getSignedUrl(${error.stack}): ${error.message}`);
  }

  return data.signedUrl;
};
