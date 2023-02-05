import { Image, StyleSheet, Text, View } from 'react-native';

export function PostComments(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.commentTitle}>Comments</Text>

      <View style={styles.commentContainer}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1674925271211-cef66b0db2f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
          }}
          style={styles.commenterAvatar}
        />

        <View>
          <View>
            <Text style={styles.commenterName}>John Snow</Text>
          </View>

          <View style={styles.commentText}>
            <Text>Wow that is a great picture!</Text>
          </View>

          <View style={styles.actions}>
            <Text style={styles.action}>Like</Text>
            <Text style={styles.action}>Reply</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  commentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  commentTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  commenterAvatar: {
    borderRadius: 50,
    height: 54,
    marginRight: 8,
    width: 54,
  },
  commenterName: {
    fontWeight: '600',
  },
  commentText: {
    marginVertical: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  action: {
    color: '#7C8089',
    marginRight: 12,
  },
});
