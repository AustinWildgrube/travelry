import { DefaultTheme } from '@react-navigation/native';

import { Theme } from '&/themes/theme-provider';

export const getNavigatorTheme = (theme: Theme) => ({
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
});
