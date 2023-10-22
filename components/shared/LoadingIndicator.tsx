import { ActivityIndicator, type ViewStyle } from 'react-native';

import { makeStyles } from '&/utils/makeStyles';

type LoadingIndicatorProps = {
  size?: 'small' | 'large';
  style?: ViewStyle;
};

export function LoadingIndicator({ size = 'large', style }: LoadingIndicatorProps): JSX.Element {
  const styles = useStyles();
  return <ActivityIndicator size={size} style={[style, styles.indicator]} />;
}

const useStyles = makeStyles(theme => ({
  indicator: {
    alignItems: 'center',
    backgroundColor: theme.colors['white'],
    flex: 1,
    justifyContent: 'center',
  },
}));
