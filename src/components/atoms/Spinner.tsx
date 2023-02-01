import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';

import { useTheme } from '&/themes/ThemeProvider';

export function Spinner(props: ActivityIndicatorProps): JSX.Element {
  const { theme } = useTheme();
  const spinnerColor = props.color ? props.color : theme.colors.primary;

  return <ActivityIndicator {...props} color={spinnerColor} />;
}
