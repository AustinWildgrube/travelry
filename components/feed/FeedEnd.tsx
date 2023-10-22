import { Alert } from 'react-native';

import { Button, Text, VStack } from '&/components/core';
import { makeStyles } from '&/utils/makeStyles';

export function FeedEnd(): JSX.Element {
  const styles = useStyle();

  const triggerAlert = (): void => {
    Alert.alert(
      'Why am I seeing this?',
      "As our community is just getting started, we've reached the end of our current content. But don't worry, there's still plenty of " +
        "room for you to help us grow! We encourage you to start sharing your own travel experiences and inspire others to do the same. Let's " +
        'build our community together!',
    );
  };

  return (
    <VStack style={styles.feedEnd}>
      <Text>You've reached the end.</Text>

      <Button onPress={triggerAlert} variant="link">
        <Button.Text>Wonder why you're seeing this?</Button.Text>
      </Button>
    </VStack>
  );
}

const useStyle = makeStyles(theme => ({
  feedEnd: {
    alignItems: 'center',
    marginVertical: theme.space['4'],
  },
}));
