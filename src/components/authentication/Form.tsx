import { useState } from 'react';
import { Pressable } from 'react-native';

import { Controller, useForm } from 'react-hook-form';
import { Button, Image, Input, Paragraph, Stack, XStack, YStack } from 'tamagui';

import { useAuth } from '&/contexts/AuthProvider';

export function Form(): JSX.Element {
  const [type, setType] = useState<'sign-up' | 'sign-in'>('sign-in');

  const { registerWithEmailAndPassword, loginWithEmailAndPassword } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const register = ({ email, password }: { email: string; password: string }) => {
    registerWithEmailAndPassword(email, password);
  };

  const login = ({ email, password }: { email: string; password: string }) => {
    loginWithEmailAndPassword(email, password);
  };

  return (
    <YStack
      borderRadius="$10"
      px="$7"
      py="$6"
      w={350}
      shadowColor="#000"
      shadowOpacity={0.1}
      shadowRadius={26}
      shadowOffset={{ width: 0, height: 4 }}
      bg="$background"
      space>
      <Paragraph size="$5" fontWeight="700" opacity={0.8} mb="$1">
        {type === 'sign-up' ? 'Create your account' : 'Log in to your account'}
      </Paragraph>

      <XStack space jc="space-evenly">
        <Button size="$5" bg="$backgroundTransparent" borderColor="$gray6Light">
          <Image
            src="https://qwvsfvhphdefqfyuuhlb.supabase.co/storage/v1/object/public/logos/Google%20logo.png"
            width={20}
            height={20}
          />
        </Button>

        <Button size="$5" bg="$backgroundTransparent" borderColor="$gray6Light">
          <Image
            src="https://qwvsfvhphdefqfyuuhlb.supabase.co/storage/v1/object/public/logos/Apple%20logo.png"
            width={22}
            height={22}
            resizeMode="contain"
          />
        </Button>

        <Button size="$5" bg="$backgroundTransparent" borderColor="$gray6Light">
          <Image
            src="https://qwvsfvhphdefqfyuuhlb.supabase.co/storage/v1/object/public/logos/Discord%20logo.png"
            resizeMode="contain"
            width={25}
            height={22}
          />
        </Button>
      </XStack>

      <XStack ai="center" width="100%" jc="space-between">
        <Stack h="$0.25" bg="black" w="$10" opacity={0.1} />

        <Paragraph size="$3" opacity={0.5}>
          or
        </Paragraph>

        <Stack h="$0.25" bg="black" w="$10" opacity={0.1} />
      </XStack>

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Email"
            textContentType="emailAddress"
          />
        )}
        name="email"
      />

      {errors.email && <Paragraph>Email Required</Paragraph>}

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Password"
            textContentType="password"
            secureTextEntry
          />
        )}
        name="password"
      />

      {errors.password && <Paragraph>Password Required</Paragraph>}

      <Button onPress={handleSubmit(type === 'sign-in' ? login : register)} hoverStyle={{ opacity: 0.8 }} themeInverse>
        {type === 'sign-up' ? 'Sign Up' : 'Sign In'}
      </Button>

      <XStack>
        <Paragraph size="$2" mr="$2" opacity={0.4}>
          {type === 'sign-up' ? 'Already have an account?' : 'Don’t have an account?'}
        </Paragraph>

        <Pressable onPress={() => setType(type === 'sign-up' ? 'sign-in' : 'sign-up')}>
          <Paragraph cursor="pointer" size="$2" fontWeight="700" opacity={0.5}>
            {type === 'sign-up' ? 'Sign in' : 'Sign up'}
          </Paragraph>
        </Pressable>
      </XStack>
    </YStack>
  );
}
