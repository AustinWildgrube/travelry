import { StyleSheet, View } from 'react-native';

import { RouteProp } from '@react-navigation/native';

import { PostComments, PostImages, PostInfo } from '&/components/post';
import { AppStackParamList } from '&/navigators/app-navigator';

interface PostScreenProps {
  route: RouteProp<AppStackParamList, 'Post'>;
}

export function PostScreen({ route }: PostScreenProps): JSX.Element {
  const { account, post, startIndex } = route.params;

  return (
    <>
      <PostImages post={post} startIndex={startIndex} />
      <PostInfo account={account} post={post} />

      <View style={styles.container}>
        <PostComments />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
});
