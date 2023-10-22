import { useColorScheme } from 'react-native';

import { Image } from '&/components/core';
import { makeStyles } from '&/utils/makeStyles';

export function Header(): JSX.Element {
  const styles = useStyles();
  const colorMode = useColorScheme();
  const logoFile = colorMode === 'dark' ? require('&/assets/logos/logo.png') : require('&/assets/logos/logo_black.png');

  return <Image source={logoFile} placeholder="LEHLh[WB2yk8pyoJadR*.7kCMdnj" style={styles.header} />;
}

const useStyles = makeStyles(theme => ({
  header: {
    height: theme.space['5'],
    width: theme.space['32'],
  },
}));
