import { FC } from 'react';

import { YStack } from 'tamagui';

import { Form } from 'src/components';

export const AuthenticationScreen: FC = (): JSX.Element => {
  return (
    <YStack jc="center" ai="center" f={1} space>
      <Form />
    </YStack>
  );
};
