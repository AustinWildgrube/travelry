import { StyleSheet, Text, View } from 'react-native';

import { PostImages } from '../../components/post/PostImages';
import { PostActions } from '../../components/post/PostActions';
import { PostComments } from '../../components/post/PostComments';

export function PostScreen({ route }: { route: any }): JSX.Element {
  const { account, post, startIndex } = route.params;

  const getRelativeTime = (timestamp: string): string => {
    const currentTime = new Date();
    const inputTime = new Date(timestamp);
    const timeDifference = currentTime.getTime() - inputTime.getTime();

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    if (timeDifference < minute) {
      const seconds = Math.floor(timeDifference / second);
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    } else if (timeDifference < hour) {
      const minutes = Math.floor(timeDifference / minute);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (timeDifference < day) {
      const hours = Math.floor(timeDifference / hour);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (timeDifference < week) {
      const days = Math.floor(timeDifference / day);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (timeDifference < month) {
      const weeks = Math.floor(timeDifference / week);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (timeDifference < year) {
      const months = Math.floor(timeDifference / month);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(timeDifference / year);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <>
      <PostImages post={post} startIndex={startIndex} />
      <PostActions account={account} />

      <View style={styles.container}>
        <Text style={styles.name}>{account.full_name}</Text>
        <Text style={styles.description}>{post.caption}</Text>
        <Text style={styles.lapsedTime}>Posted {getRelativeTime(post.created_at)} &#x2022; 44 likes</Text>

        <Text style={styles.commentTitle}>Comments</Text>
        <PostComments />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 21,
    fontWeight: '600',
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    marginVertical: 8,
  },
  lapsedTime: {
    color: '#7C8089',
    fontSize: 12,
    marginBottom: 21,
  },
  commentTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
});
