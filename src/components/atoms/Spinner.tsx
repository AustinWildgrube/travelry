import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';

import { useTheme } from '&/themes/ThemeProvider';

interface SpinnerProps {
  props: ActivityIndicatorProps;
}

export function Spinner({ props }: SpinnerProps): JSX.Element {
  const { theme } = useTheme();
  const spinnerColor = props.color ? props.color : theme.colors.primary;

  return <ActivityIndicator {...props} color={spinnerColor} />;
}
