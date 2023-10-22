import { StyleSheet, View, useColorScheme } from 'react-native';

import { ResizeMode, Video } from 'expo-av';
import { Slot, usePathname } from 'expo-router';
import Animated, { Easing, FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Image } from '&/components/core';
import { makeStyles } from '&/utils/makeStyles';

export default function AuthLayout(): JSX.Element {
  const styles = useStyles();
  const pathname = usePathname();
  const colorMode = useColorScheme();

  const logoFile = pathname === '/' || colorMode === 'dark' ? require('&/assets/logos/logo.png') : require('&/assets/logos/logo_black.png');
  const fadeInAnimation = FadeIn.duration(1000).easing(Easing.linear).withInitialValues({ opacity: 0.1 });

  return (
    <SafeAreaView style={styles.container}>
      {pathname === '/' && (
        <View style={styles.background}>
          <Animated.View entering={fadeInAnimation} style={styles.backgroundViewWrapper}>
            <Video
              source={require('&/assets/backgrounds/bg.mp4')}
              resizeMode={ResizeMode.COVER}
              style={styles.backgroundVideo}
              shouldPlay
              isLooping
              isMuted
            />
          </Animated.View>

          <View style={styles.overlay} />
        </View>
      )}

      <View style={styles.logoWrapper}>
        <Image source={logoFile} style={styles.logo} />
      </View>

      <Slot />
    </SafeAreaView>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.space['4'],
    paddingVertical: theme.space['0'],
  },
  background: {
    backgroundColor: theme.colors['dark50'],
    ...StyleSheet.absoluteFillObject,
  },
  backgroundViewWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundVideo: {
    flex: 1,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    ...StyleSheet.absoluteFillObject,
  },
  logoWrapper: {
    alignItems: 'center',
  },
  logo: {
    height: 16,
    width: 100,
  },
}));
