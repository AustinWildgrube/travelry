import { useNavigation } from '@react-navigation/core';
import { RouteProp } from '@react-navigation/native';

import { PostComments, PostImages, PostInfo } from '&/components/post';
import { AppNavProps, AppStackParamList } from '&/navigators/app-navigator';

interface PostScreenProps {
  route: RouteProp<AppStackParamList, 'Post'>;
}

export function PostScreen({ route }: PostScreenProps): JSX.Element {
  const navigation = useNavigation<AppNavProps<'Post'>>();
  const { account, post, startIndex } = route.params;

  return (
    <>
      <PostImages navigation={navigation} post={post} startIndex={startIndex} />
      <PostInfo account={account} post={post} />
      <PostComments />
    </>
  );
}
