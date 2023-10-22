import { useRouter } from 'expo-router';

import { Button } from '&/components/core';
import { LoadingIndicator } from '&/components/shared';
import { useMessageStore } from '&/stores/message';
import { useUserStore } from '&/stores/user';
import { makeStyles } from '&/utils/makeStyles';

export default function CreateConversation(): JSX.Element {
  const styles = useStyles();
  const router = useRouter();
  const chosenRecipients = useMessageStore(state => state.chosenRecipients);

  const user = useUserStore(state => state.user);
  if (!user) return <LoadingIndicator />;

  const checkForExistingConversation = (): void => {
    const conversation: any = false;
    closeModalAndNavigate(conversation ? conversation.id : 'new');
  };

  const closeModalAndNavigate = (path: string): void => {
    router.back();
    router.push(`/conversations/${path}`);
  };

  return (
    <Button onPress={checkForExistingConversation} variant="link" isDisabled={chosenRecipients.length === 0} style={styles.submitButton}>
      <Button.Text>Done</Button.Text>
    </Button>
  );
}

const useStyles = makeStyles(theme => ({
  submitButton: {
    paddingHorizontal: theme.space['0'],
  },
}));
