import { Fragment } from 'react';
import { View } from 'react-native';

import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, FormControl, Heading, Icon, Input, Text } from '&/components/core';
import { WarningIcon } from '&/components/core/Icons/Icons/Warning';
import { useAuth } from '&/contexts/Authentication';
import { makeStyles } from '&/utils/makeStyles';

const LoginFormSchema = z.object({
  email: z
    .string()
    .email()
    .refine(val => val.trim().length > 0, {
      message: 'Your email is required',
    }),
  password: z.string().refine(val => val.trim().length > 0, {
    message: 'Your password is required',
  }),
});

type LoginForm = z.infer<typeof LoginFormSchema>;

export default function Login(): JSX.Element {
  const styles = useStyles();
  const { loginWithOAuth, loginWithPassword } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginFormSchema),
  });

  const submitLoginForm = ({ email, password }: LoginForm): void => {
    loginWithPassword(email, password);
  };

  return (
    <Fragment>
      <View style={styles.login}>
        <Heading size="3xl" style={styles.loginHeading}>
          Welcome Back!
        </Heading>

        <Text style={styles.loginSubHeading}>We're glad you're here with us today to share some memories with the world!</Text>

        <Controller
          name="email"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl isInvalid={!!errors.email} isRequired={true} style={styles.formControl}>
              <FormControl.Label>
                <FormControl.Label.Text>Email</FormControl.Label.Text>
              </FormControl.Label>

              <Input>
                <Input.Input placeholder="Email" autoCapitalize="none" inputMode="email" onChangeText={onChange} onBlur={onBlur} value={value} />
              </Input>

              <FormControl.Error>
                <FormControl.Error.Icon>
                  <Icon as={WarningIcon} style={styles.formControlIcon} />
                </FormControl.Error.Icon>

                <FormControl.Error.Text>{errors.email?.message}</FormControl.Error.Text>
              </FormControl.Error>
            </FormControl>
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl isInvalid={!!errors.password} isRequired={true} style={styles.formControl}>
              <FormControl.Label>
                <FormControl.Label.Text>Password</FormControl.Label.Text>
              </FormControl.Label>

              <Input>
                <Input.Input placeholder="Password" autoCapitalize="none" type="password" onChangeText={onChange} onBlur={onBlur} value={value} />
              </Input>

              <FormControl.Error>
                <FormControl.Error.Icon>
                  <Icon as={WarningIcon} style={styles.formControlIcon} />
                </FormControl.Error.Icon>

                <FormControl.Error.Text>{errors.password?.message}</FormControl.Error.Text>
              </FormControl.Error>
            </FormControl>
          )}
        />

        <Button onPress={handleSubmit(submitLoginForm)}>
          <Button.Text>Login</Button.Text>
        </Button>

        <Text size="sm" style={styles.loginAlternative}>
          Or Login With
        </Text>

        <View style={styles.loginOAuthButtons}>
          <Button onPress={() => loginWithOAuth('apple')} style={[styles.loginOAuthButton, styles.appleButton]}>
            <AntDesign name="apple1" size={18} style={styles.socialButtonIcon} />
            <Button.Text>Apple</Button.Text>
          </Button>

          <Button onPress={() => loginWithOAuth('google')} style={[styles.loginOAuthButton, styles.googleButton]}>
            <AntDesign name="google" size={18} style={styles.socialButtonIcon} />
            <Button.Text>Google</Button.Text>
          </Button>
        </View>

        <View style={styles.loginOAuthButtons}>
          <Button onPress={() => loginWithOAuth('facebook')} style={[styles.loginOAuthButton, styles.facebookButton]}>
            <FontAwesome5 name="facebook-f" size={18} style={styles.socialButtonIcon} />
            <Button.Text>Facebook</Button.Text>
          </Button>

          <Button onPress={() => loginWithOAuth('twitter')} style={[styles.loginOAuthButton, styles.twitterButton]}>
            <AntDesign name="twitter" size={18} style={styles.socialButtonIcon} />
            <Button.Text>Twitter</Button.Text>
          </Button>
        </View>
      </View>

      <Link href="/register" style={styles.registerButton}>
        Don't already have an account? Register
      </Link>
    </Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  login: {
    flex: 1,
    justifyContent: 'center',
  },
  loginHeading: {
    color: theme.colors['black'],
    textAlign: 'center',
  },
  loginSubHeading: {
    marginBottom: theme.space['6'],
    marginHorizontal: theme.space['6'],
    textAlign: 'center',
  },
  formControl: {
    marginBottom: theme.space['4'],
  },
  formControlIcon: {
    color: theme.colors['red500'],
    height: theme.space['3'],
    width: theme.space['3'],
  },
  loginAlternative: {
    marginVertical: theme.space['6'],
    textAlign: 'center',
  },
  loginOAuthButtons: {
    flexDirection: 'row',
    gap: theme.space['3'],
    marginBottom: theme.space['2'],
  },
  loginOAuthButton: {
    flex: 1,
  },
  appleButton: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  googleButton: {
    backgroundColor: '#d64f3e',
    borderColor: '#d64f3e',
  },
  facebookButton: {
    backgroundColor: '#3579eb',
    borderColor: '#3579eb',
  },
  twitterButton: {
    backgroundColor: '#449fee',
    borderColor: '#449fee',
  },
  socialButtonIcon: {
    color: theme.colors['white'],
    marginRight: theme.space['2'],
  },
  registerButton: {
    color: theme.colors['black'],
    textAlign: 'center',
  },
}));
