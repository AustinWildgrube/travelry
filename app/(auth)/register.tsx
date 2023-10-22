import { Fragment, useRef } from 'react';
import { View } from 'react-native';

import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import type BottomSheet from '@gorhom/bottom-sheet';
import { Link } from 'expo-router';

import { RegistrationForm } from '&/components/auth/RegistrationForm';
import { Button, Heading, Text } from '&/components/core';
import { useAuth } from '&/contexts/Authentication';
import { makeStyles } from '&/utils/makeStyles';

export default function Register(): JSX.Element {
  const styles = useStyles();
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const { loginWithOAuth } = useAuth();

  return (
    <Fragment>
      <View style={styles.registration}>
        <Heading size="3xl" style={styles.registrationHeading}>
          Sign Up for Travelry
        </Heading>

        <Text style={styles.registrationSubheading}>Create an account to share memories you've made with the world.</Text>

        <View style={styles.socialButtonContainer}>
          <Button onPress={() => bottomSheetRef.current?.expand()} size="lg">
            <Button.Text>Continue With Email</Button.Text>
          </Button>

          <Button onPress={() => loginWithOAuth('apple')} size="lg" style={styles.appleButton}>
            <AntDesign name="apple1" size={18} style={styles.socialButtonIcon} />
            <Button.Text>Continue With Apple</Button.Text>
          </Button>

          <Button onPress={() => loginWithOAuth('google')} size="lg" style={styles.googleButton}>
            <AntDesign name="google" size={18} style={styles.socialButtonIcon} />
            <Button.Text>Continue With Google</Button.Text>
          </Button>

          <Button onPress={() => loginWithOAuth('facebook')} size="lg" style={styles.facebookButton}>
            <FontAwesome5 name="facebook-f" size={18} style={styles.socialButtonIcon} />
            <Button.Text>Continue With Facebook</Button.Text>
          </Button>

          <Button onPress={() => loginWithOAuth('twitter')} size="lg" style={styles.twitterButton}>
            <AntDesign name="twitter" size={18} style={styles.socialButtonIcon} />
            <Button.Text>Continue With Twitter</Button.Text>
          </Button>
        </View>
      </View>

      <Link href="/login" style={styles.loginButton}>
        Already have an account? Log in
      </Link>

      <RegistrationForm bottomSheetRef={bottomSheetRef} />
    </Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  registration: {
    flex: 1,
    justifyContent: 'center',
  },
  registrationHeading: {
    textAlign: 'center',
  },
  registrationSubheading: {
    marginBottom: theme.space['6'],
    marginHorizontal: theme.space['6'],
    textAlign: 'center',
  },
  socialButtonContainer: {
    gap: theme.space['2'],
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
  loginButton: {
    color: theme.colors['black'],
    textAlign: 'center',
  },
}));
