import { memo } from 'react';

import { Controller, type Control } from 'react-hook-form';

import { Avatar, CheckIcon, Checkbox, HStack, Heading, Text, VStack } from '&/components/core';
import { useAvatarQuery } from '&/hooks/useAvatarQuery';
import { useMessageStore } from '&/stores/message';
import { type UserSummary } from '&/types/types';
import { makeStyles } from '&/utils/makeStyles';

type RecipientProps = {
  formControl: Control;
  user: UserSummary;
};

function Recipient({ user, formControl }: RecipientProps): JSX.Element {
  const styles = useStyles();
  const { data: avatar } = useAvatarQuery(user.id, user.avatar_url);
  const { addRecipient, chosenRecipients, removeRecipient } = useMessageStore();

  const isInitiallyChecked = chosenRecipients.includes(user.id);

  const handleRecipientChange = (isChecked: boolean): void => {
    isChecked ? addRecipient(user.id) : removeRecipient(user.id);
  };

  return (
    <Controller
      name="recipients"
      control={formControl}
      render={() => (
        <Checkbox
          value={user.id}
          onChange={handleRecipientChange}
          defaultIsChecked={isInitiallyChecked}
          aria-label="Choose recipient"
          style={styles.recipient}>
          <Checkbox.Label style={styles.recipientLabel}>
            <HStack space="sm">
              <Avatar>
                <Avatar.FallbackText>
                  {user.first_name} {user.last_name}
                </Avatar.FallbackText>

                <Avatar.Image source={{ uri: avatar }} placeholder={user.avatar_placeholder} />
              </Avatar>

              <VStack>
                <Heading size="sm">
                  {user.first_name} {user.last_name}
                </Heading>

                <Text>@{user.username}</Text>
              </VStack>
            </HStack>
          </Checkbox.Label>

          <Checkbox.Indicator>
            <Checkbox.Icon as={CheckIcon} />
          </Checkbox.Indicator>
        </Checkbox>
      )}
    />
  );
}

const useStyles = makeStyles(theme => ({
  recipient: {
    marginTop: theme.space['4'],
  },
  recipientLabel: {
    flex: 1,
  },
}));

export const MemoizedRecipient = memo(Recipient);
