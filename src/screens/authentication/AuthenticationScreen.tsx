import { YStack } from 'tamagui';

import { Form } from '&/components/authentication';

export function AuthenticationScreen(): JSX.Element {
  return (
    <YStack jc="center" ai="center" f={1} space>
      <Form />
    </YStack>
  );
}
