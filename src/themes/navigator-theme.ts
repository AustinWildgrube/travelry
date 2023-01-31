import { DefaultTheme } from '@react-navigation/native';

import { Theme } from '&/themes/ThemeProvider';

export const getNavigatorTheme = (theme: Theme) => ({
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
});
