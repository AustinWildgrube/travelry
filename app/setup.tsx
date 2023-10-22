import { Fragment, useState } from 'react';

import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Confetti, SetupProfileDetails, SetupProfileImage } from '&/components/auth';
import { Button, Heading, Text } from '&/components/core';
import { CONFETTI_FALL_SPEED, CONFETTI_ITEM_HEIGHT, CONFETTI_ITEM_WIDTH } from '&/utils/constants';
import { makeStyles } from '&/utils/makeStyles';

export default function Setup(): JSX.Element {
  const styles = useStyles();
  const [step, setStep] = useState(0);

  return (
    <SafeAreaView style={styles.setup}>
      <Heading>Setup your profile</Heading>

      {step === 0 ? (
        <Fragment>
          <Text style={styles.setupSlogan}>Upload an image - it's worth a thousand words</Text>
          <SetupProfileImage setStep={setStep} />

          <Button onPress={() => setStep(1)} variant="link" style={styles.skipLink}>
            <Button.Text>Skip</Button.Text>
          </Button>

          <Confetti
            fallSpeed={CONFETTI_FALL_SPEED}
            flipSpeed={3}
            horizSpeed={50}
            itemColors={['#84a98c', '#ffb703', '#023047']}
            itemDimensions={{ height: CONFETTI_ITEM_HEIGHT, width: CONFETTI_ITEM_WIDTH }}
            itemTintStrength={0.8}
            numItems={100}
          />
        </Fragment>
      ) : (
        <Fragment>
          <Text style={styles.setupSlogan}>Tell the world a little about yourself</Text>
          <SetupProfileDetails />

          <Link href="/feed" asChild>
            <Button variant="link" style={styles.skipLink}>
              <Button.Text>Skip</Button.Text>
            </Button>
          </Link>
        </Fragment>
      )}
    </SafeAreaView>
  );
}

const useStyles = makeStyles(theme => ({
  setup: {
    flex: 1,
    padding: theme.space['4'],
  },
  setupSlogan: {
    marginTop: theme.space['1'],
    marginBottom: theme.space['6'],
  },
  skipLink: {
    marginTop: theme.space['3'],
    zIndex: -1,
  },
}));
