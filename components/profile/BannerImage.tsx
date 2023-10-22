import { ImageBackground, View } from 'react-native';

import { type BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';

import { makeStyles } from '&/utils/makeStyles';

export function BannerImage({ style }: BottomSheetBackgroundProps): JSX.Element {
  const styles = useStyles();
  const gradientColors = ['rgba(0, 0, 0, 0)', 'rgba(255, 255, 255, .1)', 'rgba(252, 252, 252, 1)'];

  // TODO: Replace with real image
  const bannerImage =
    'https://images.unsplash.com/photo-1684654488308-2229de99e7a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80';

  return (
    <View pointerEvents="none" style={[style, styles.banner]}>
      <ImageBackground source={{ uri: bannerImage }} style={styles.bannerImage}>
        <LinearGradient colors={gradientColors} style={styles.bannerGradient} />
      </ImageBackground>
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  banner: {
    borderRadius: theme.radii['xl'],
    overflow: 'hidden',
  },
  bannerImage: {
    borderBottomLeftRadius: theme.radii['xl'],
    borderBottomRightRadius: theme.radii['xl'],
    flex: 1,
    height: theme.space[32],
  },
  bannerGradient: {
    height: theme.space[32],
    marginTop: theme.space[6],
    width: theme.space['full'],
  },
}));
