// import { getSignedStorageUrl } from '&/queries/signature';
// import { useSignatureStore } from '&/stores/signatures';

export const getPublicImageUrl = async (bucket: 'avatars' | 'posts', path: string | null): Promise<string> => {
  if (!path) return '';
  // const fetchedAt = useSignatureStore.getState().fetchedAt;

  // check that the token is not expired or null
  // if (useSignatureStore.getState().isExpired()) {
  //   const signedUrl = await getSignedStorageUrl(bucket, path);
  //   const searchParams = new URLSearchParams(new URL(signedUrl).search);
  //   const urlToken = searchParams.get('token');
  //
  //   if (urlToken) {
  //     useSignatureStore.setState({ token: urlToken });
  //     useSignatureStore.setState({ fetchedAt: Date.now() });
  //   }
  // }

  // return `https://xilfwzpwcchiivwulkbn.supabase.co/storage/v1/object/sign/${bucket}/${path}?token=${useSignatureStore.getState().token}`;
  return 'https://images.unsplash.com/photo-1679678691006-0ad24fecb769?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80';
};
