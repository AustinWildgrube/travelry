import { useNavigation } from '@react-navigation/core';
import { RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { PostComments, PostImages, PostInfo } from '&/components/post';
import { type AppNavProps, type AppStackParamList } from '&/navigators/root-navigator';
import { getPostById } from '&/queries/posts';
import { getUserProfile } from '&/queries/users';

interface PostScreenProps {
  route: RouteProp<AppStackParamList, 'Post'>;
}

export function PostScreen({ route }: PostScreenProps): JSX.Element {
  const navigation = useNavigation<AppNavProps<'Post'>>();
  const { accountId, postId, startIndex } = route.params;

  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  });

  const { data: account, isLoading: isLoadingAccount } = useQuery({
    queryKey: ['account', accountId],
    queryFn: () => getUserProfile(accountId),
  });

  return (
    <>
      {!isLoadingPost && post && account && !isLoadingAccount && (
        <>
          <PostImages navigation={navigation} post={post} startIndex={startIndex} />
          <PostInfo account={account} post={post} />
          <PostComments />
        </>
      )}
    </>
  );
}
