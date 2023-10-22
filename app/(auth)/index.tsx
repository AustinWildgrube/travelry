import { Fragment } from 'react';
import { View } from 'react-native';

import { Link } from 'expo-router';

import { Button, Heading } from '&/components/core';
import { makeStyles } from '&/utils/makeStyles';

export default function Index(): JSX.Element {
  const styles = useStyles();

  return (
    <Fragment>
      <View style={styles.sloganWrapper}>
        <Heading size="4xl" style={styles.slogan}>
          Share memories you've made with the world.
        </Heading>
      </View>

      <Link href="/register" asChild>
        <Button>
          <Button.Text>Register</Button.Text>
        </Button>
      </Link>

      <Link href="/login" asChild>
        <Button style={styles.loginButton}>
          <Button.Text style={styles.loginButtonTitle}>Login</Button.Text>
        </Button>
      </Link>
    </Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  sloganWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  slogan: {
    color: theme.colors['white'],
    fontFamily: 'Inter_800ExtraBold',
    fontWeight: theme.fontWeights['extrabold'],
    justifyContent: 'flex-end',
    textAlign: 'center',
    textShadowColor: theme.colors['primary100'],
    textShadowOffset: { height: 2, width: 1 },
    textShadowRadius: 2,
  },
  // TODO: make a white variant?
  loginButton: {
    backgroundColor: theme.colors['white'],
    borderColor: theme.colors['secondary200'],
    marginTop: theme.space['2'],
  },
  loginButtonTitle: {
    color: theme.colors['black'],
  },
}));
