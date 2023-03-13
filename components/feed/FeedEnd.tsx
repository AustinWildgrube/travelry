import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export function FeedEnd(): JSX.Element {
  return (
    <View style={styles.endOfContent}>
      <Text>You've reached the end.</Text>

      <Pressable
        onPress={() =>
          Alert.alert(
            'Why am I seeing this?',
            "As our community is just getting started, we've reached the end of our current content. But don't worry, there's still plenty of " +
              "room for you to help us grow! We encourage you to start sharing your own travel experiences and inspire others to do the same. Let's " +
              'build our community together!',
          )
        }>
        <Text style={styles.endOfContentButton}>Wonder why you're seeing this?</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  endOfContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  endOfContentButton: {
    color: '#1565c0',
  },
});
